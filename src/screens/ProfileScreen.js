import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../assets/colors';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const ProfileScreen = ({navigation, route}) => {
  const {userId} = route.params;
  const [user, setUser] = useState();
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState();

  useEffect(() => {
    let subscribeUser = () => {};

    if (userId) {
      subscribeUser = firestore()
        .collection('users')
        .doc(userId)
        .onSnapshot(documentSnapshot => {
          setUser(documentSnapshot.data());
          setName(documentSnapshot.data().name);
        });
    }
    return () => {
      subscribeUser();
    };
  }, [userId]);

  const signOut = () => {
    GoogleSignin.revokeAccess();
    auth().signOut();
  };

  const onClose = () => {
    navigation.navigate('Home');
  };

  const onEditable = () => {
    setEditable(true);
  };

  const onNameChange = value => {
    setName(value);
  };

  const onCancel = () => {
    setName(user?.name);
    setEditable(false);
  };

  const onSave = () => {
    firestore()
      .collection('users')
      .doc(userId)
      .update({
        name: name,
      })
      .then(() => {
        Alert.alert('Thay đổi thành công!');
        setEditable(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={{
          uri: 'https://st3.depositphotos.com/6741230/13012/v/950/depositphotos_130128092-stock-illustration-doodles-seamless-pattern-vector-set.jpg',
        }}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require('../assets/images/splash.png')}
          />
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.red}
            borderColor="black"
            backgroundDarker="black"
            textFontFamily="icielPony"
            borderRadius={100}
            width={null}
            onPress={onClose}
            raiseLevel={5}>
            <Icon name="close" size={24} color="white" />
          </ThemedButton>
        </View>
        {user && (
          <View style={styles.content}>
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={{
                  uri: user.photo,
                }}
              />
              <TextInput
                style={styles.input}
                value={name}
                editable={editable}
                onChangeText={value => onNameChange(value)}
              />
              {!editable ? (
                <ThemedButton
                  name="bruce"
                  type="anchor"
                  backgroundColor={colors.green}
                  borderColor="black"
                  backgroundDarker="black"
                  textFontFamily="icielPony"
                  raiseLevel={5}
                  width={null}
                  onPress={onEditable}
                  style={styles.button}>
                  <Text style={styles.text}>Thay đổi</Text>
                </ThemedButton>
              ) : (
                <View style={styles.changeBtnContainer}>
                  <ThemedButton
                    name="bruce"
                    type="anchor"
                    backgroundColor={colors.red}
                    borderColor="black"
                    backgroundDarker="black"
                    textFontFamily="icielPony"
                    raiseLevel={5}
                    width={null}
                    onPress={onCancel}
                    style={styles.button}>
                    <Text style={styles.text}>Hủy</Text>
                  </ThemedButton>
                  <ThemedButton
                    name="bruce"
                    type="anchor"
                    backgroundColor={colors.blue}
                    borderColor="black"
                    backgroundDarker="black"
                    textFontFamily="icielPony"
                    raiseLevel={5}
                    width={null}
                    onPress={onSave}
                    style={styles.button}>
                    <Text style={styles.text}>Lưu</Text>
                  </ThemedButton>
                </View>
              )}
            </View>

            <ThemedButton
              name="bruce"
              type="anchor"
              backgroundColor={colors.red}
              borderColor="black"
              backgroundDarker="black"
              textFontFamily="icielPony"
              raiseLevel={5}
              onPress={signOut}
              style={styles.button}>
              <Text style={styles.text}>Đăng xuất</Text>
            </ThemedButton>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    // resizeMode: "contain",
  },
  logo: {
    height: 80,
    width: 160,
    resizeMode: 'contain',
    backgroundColor: '#ced4da',
    opacity: 0.9,
    borderRadius: 19,
  },
  header: {
    // flex: 1,
    // backgroundColor: "red",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 40,
  },
  text: {
    fontFamily: 'icielPony',
    fontSize: 30,
    color: '#333',
  },
  button: {
    marginTop: 0,
  },
  avatarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  avatar: {
    height: 160,
    width: 160,
    resizeMode: 'contain',
    backgroundColor: '#ced4da',
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'black',
  },
  input: {
    height: 50,
    width: '60%',
    borderWidth: 4,
    borderColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 100,
    fontSize: 24,
  },
  changeBtnContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
});
