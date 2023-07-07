/* eslint-disable react/react-in-jsx-scope */
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../assets/colors';
import commonStyles from '../assets/styles/commonStyles';

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
        source={require('../assets/images/bg2.jpg')}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../assets/images/logo.png')}
            />
            <Text style={styles.gameName}>Draw & Guess</Text>
          </View>
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.blue}
            borderColor={colors.darkBlue}
            backgroundDarker={colors.darkBlue}
            textFontFamily="Pony"
            raiseLevel={5}
            paddingTop={5}
            paddingBottom={5}
            style={styles.button}
            paddingHorizontal={24}
            width={null}
            onPress={() =>
              onGoogleButtonPress()
                .then(() => console.log('Signed in with Google!'))
                .catch(error => console.log(error))
            }>
            <Icon name="google" size={40} color="white" />
            <Text
              style={[commonStyles.buttonText, {fontSize: 20, marginLeft: 5}]}>
              Đăng nhập với Google
            </Text>
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

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
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
    fontSize: 40,
    color: '#f59f00',
    fontFamily: 'icielPony',
    textShadowColor: '#585858',
    textShadowOffset: {width: 2, height: 1},
    textShadowRadius: 5,
  },
  button: {
    marginBottom: 20,
  },
  googleIcon: {
    height: 50,
    width: 50,
  },
  logoContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  gameName: {
    fontFamily: 'icielPony',
    fontSize: 32,
    color: colors.darkGreen,
  },
  logo: {
    height: 160,
    width: 160,
    resizeMode: 'contain',
    zIndex: 10,
  },
});
