import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import CreateRoomScreen from './src/screens/CreateRoomScreen';
import DrawScreen from './src/screens/DrawScreen';
import GuessScreen from './src/screens/GuessScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const onAuthStateChanged = async user => {
    setUser(user);

    if (user) {
      const saveduser = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();

      if (!saveduser.exists) {
        firestore().collection('users').doc(user.uid).set({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        });
      }
    }
    if (initializing) setInitializing(false);
  };

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
          initialParams={{user}}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateRoomScreen"
          component={CreateRoomScreen}
          initialParams={{user}}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GuessScreen"
          component={GuessScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DrawScreen"
          component={DrawScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
