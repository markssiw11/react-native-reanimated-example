/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image
} from 'react-native';
import { useSharedValue } from "react-native-reanimated";
import { Card } from './src/Card';
// import { Card } from './src/Card1';
const cards = [
  {
    source: require("./assets/Images/death.png"),
  },
  {
    source: require("./assets/Images/chariot.png"),
  },
  {
    source: require("./assets/Images/high-priestess.png"),
  },
  {
    source: require("./assets/Images/justice.png"),
  },
  {
    source: require("./assets/Images/lover.png"),
  },
  {
    source: require("./assets/Images/pendu.png"),
  },
  {
    source: require("./assets/Images/tower.png"),
  },
  {
    source: require("./assets/Images/strength.png"),
  },
];
const App = () => {
  const shuffleBack = useSharedValue(false);
  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <Card card={card} key={index} index={index} shuffleBack={shuffleBack} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey'
  },
  imageContainer: {
    height: 300,
    width: 150
  }
});

export default App;
