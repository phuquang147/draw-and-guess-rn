import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import CreateRoomScreen from './src/screens/CreateRoomScreen';
import JoinRoomScreen from './src/screens/JoinRoomScreen';
import GuessScreen from './src/screens/GuessScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ManageTopicsScreen from './src/screens/ManageTopicsScreen';
import NewTopicScreen from './src/screens/NewTopicScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import {LogBox} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import LostConnectionScreen from './src/screens/LostConnectionScreen';

const Stack = createNativeStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const netInfo = useNetInfo();

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

  if (!netInfo.isConnected) return <LostConnectionScreen />;
  if (!user) {
    return <LoginScreen />;
  }

  LogBox.ignoreAllLogs();

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
          name="JoinRoomScreen"
          component={JoinRoomScreen}
          initialParams={{user}}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GuessScreen"
          component={GuessScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ManageTopicsScreen"
          component={ManageTopicsScreen}
          initialParams={{user}}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NewTopicScreen"
          component={NewTopicScreen}
          initialParams={{user}}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
