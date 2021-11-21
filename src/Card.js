import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, Dimensions, Animated as AnimatedRN} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { snapPoint } from "react-native-redash";
const {width, height} = Dimensions.get('window');
const aspectRatio = 722 / 368;
const CARD_WIDTH = width - 128;
const CARD_HEIGHT = CARD_WIDTH * aspectRatio;
const IMAGE_WIDTH = CARD_WIDTH * 0.9;
const IMAGE_HEIGHT = IMAGE_WIDTH * aspectRatio;
const SNAP_POINTS = [-width, 0, width];
const DURATION = 500;
export const Card = ({card: {source}, index, shuffleBack}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(-height);
  const theta = Math.random()*20 - 10;
  const rotateZ = useSharedValue(0);
  const scale = useSharedValue(1);
  useAnimatedReaction(
    () => shuffleBack.value,
    () => {
      if (shuffleBack.value) {
        const delay = 150*index;
        translateX.value = withDelay(delay, withSpring(0));
        rotateZ.value = withDelay(delay, withSpring(theta),() => {
          shuffleBack.value  = false;
        })
      }
    }
  )
  useEffect(() => {
    const delay = index*DURATION;
    translateY.value  = withDelay(delay, withTiming(0, {
      duration: DURATION,
      easing: Easing.inOut(Easing.ease)
    }))
    rotateZ.value = withDelay(delay, withTiming(theta, {
      duration: DURATION,
      easing: Easing.inOut(Easing.ease)

    }))

  }, [index, translateY, theta])
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      scale.value = withTiming(1.1,{ easing: Easing.inOut(Easing.ease)});
      rotateZ.value = withTiming(0, {easing: Easing.inOut(Easing.ease)})
    },
    onActive: ({translationX, translationY}, ctx) => {
      translateX.value = ctx.startX + translationX;
      translateY.value = ctx.startY + translationY;
    },
    onEnd: ({velocityX, velocityY}) => {
      const dest = snapPoint(translateX.value, velocityX, SNAP_POINTS)

      translateX.value = withSpring(dest, {velocity: velocityX});
      translateY.value = withSpring(0, {velocity: velocityY});
      scale.value = withTiming(1, {easing: Easing.inOut(Easing.ease)}, () => {
        if (index === 0 && dest !== 0) {
          shuffleBack.value = true;
        }
      })
    }
  });
  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
      {
        perspective: 1500
      },
      {
        rotateX: "30deg"
      },
      {
        rotateZ: `${rotateZ.value} deg`
      },
      {
        scale: scale.value
      }
    ],
  }));
  return (
    <View style={styles.container} pointerEvents="box-none">
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.card, style]}>
          <Image
            source={source}
            style={{
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
            }}
            resizeMode="contain"
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
