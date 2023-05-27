import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import CreateRoomScreen from './src/screens/CreateRoomScreen';
import DrawScreen from './src/screens/DrawScreen';
import GuessScreen from './src/screens/GuessScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DrawScreen"
          component={DrawScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateRoomScreen"
          component={CreateRoomScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GuessScreen"
          component={GuessScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
