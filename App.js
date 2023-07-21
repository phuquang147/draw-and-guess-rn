import {useNetInfo} from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {createContext, useEffect, useState} from 'react';
import {LogBox} from 'react-native';
import CreateRoomScreen from './src/screens/CreateRoomScreen';
import GuessScreen from './src/screens/GuessScreen';
import HomeScreen from './src/screens/HomeScreen';
import JoinRoomScreen from './src/screens/JoinRoomScreen';
import LoginScreen from './src/screens/LoginScreen';
import LostConnectionScreen from './src/screens/LostConnectionScreen';
import ManageRequestsScreen from './src/screens/ManageRequestsScreen';
import ManageTopicsScreen from './src/screens/ManageTopicsScreen';
import NewTopicScreen from './src/screens/NewTopicScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RequestDetailScreen from './src/screens/RequestDetailScreen';

const Stack = createNativeStackNavigator();

export const UserContext = createContext();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userRole, setUserRole] = useState(undefined);

  const netInfo = useNetInfo();

  const onAuthStateChanged = async user => {
    setUser(user);
    if (user) {
      const saveduser = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();

      if (!saveduser.exists) {
        firestore()
          .collection('users')
          .doc(user.uid)
          .set({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
          })
          .then(snapshot => {
            setUserRole(snapshot.data().role);
          });
      } else {
        setUserRole(saveduser.data().role);
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
    <UserContext.Provider value={{user, userRole}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CreateRoomScreen"
            component={CreateRoomScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="JoinRoomScreen"
            component={JoinRoomScreen}
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
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="NewTopicScreen"
            component={NewTopicScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ManageRequestsScreen"
            component={ManageRequestsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RequestDetailScreen"
            component={RequestDetailScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

export default App;
