import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './components/Login/Login';
import Games from './components/Games/Games';
import SingleGame from './components/Games/SingleGame';
import Favorites from './components/Favorites/Favorites';
import * as Font from 'expo-font';

const Stack = createNativeStackNavigator();

const App = () => {

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        zelda: require('./assets/fonts/zelda.otf')
      });
    };

    loadFonts();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Games" component={Games} />
        <Stack.Screen name="SingleGame" component={SingleGame} />
        <Stack.Screen name="Favorites" component={Favorites} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
