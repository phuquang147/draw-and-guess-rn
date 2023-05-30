/* eslint-disable react/react-in-jsx-scope */
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../assets/colors';
import WordSelectionModal from '../components/WordSelectionModal';
import PhotoSelectionModal from '../components/PhotoSelectionModal';

GoogleSignin.configure({
  webClientId:
    '145827713844-3t89ra9al6holq17g0igjnu28q1qock9.apps.googleusercontent.com',
});

const LoginScreen = () => {
  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const {idToken} = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    return auth().signInWithCredential(googleCredential);
  }

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
            textFontFamily="Pony"
            borderRadius={100}
            width={null}
            raiseLevel={5}>
            <Icon name="close" size={24} color="white" />
          </ThemedButton>
        </View>
        <View style={styles.content}>
          <Text style={styles.loginText}>ĐĂNG NHẬP</Text>
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.blue}
            borderColor="black"
            backgroundDarker="black"
            textFontFamily="Pony"
            raiseLevel={5}
            paddingTop={5}
            paddingBottom={5}
            style={styles.button}
            paddingHorizontal={5}
            width={null}
            onPress={() =>
              onGoogleButtonPress()
                .then(() => console.log('Signed in with Google!'))
                .catch(error => console.log(error))
            }>
            <Image
              style={styles.googleIcon}
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png',
              }}
            />
            <Text style={styles.text}>Đăng nhập với Google</Text>
          </ThemedButton>
        </View>
      </ImageBackground>
      {/* <PhotoSelectionModal /> */}
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    // resizeMode: "contain",
    color: 'red',
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
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'icielPony',
    fontSize: 20,
    color: '#333',
    marginLeft: 10,
  },
  loginText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 60,
    color: '#f59f00',
    fontFamily: 'icielPony',
    textShadowColor: '#585858',
    textShadowOffset: {width: 10, height: 5},
    textShadowRadius: 5,
  },
  button: {
    marginBottom: 20,
  },
  googleIcon: {
    height: 50,
    width: 50,
    // resizeMode: "contain",
  },
});
