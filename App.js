import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import CreateRoomScreen from './src/screens/CreateRoomScreen';
import DrawScreen from './src/screens/DrawScreen';
import GuessScreen from './src/screens/GuessScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    console.log(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
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
