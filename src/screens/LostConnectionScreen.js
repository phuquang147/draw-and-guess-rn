import firestore from '@react-native-firebase/firestore';
import {useState} from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import FIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../assets/colors';
import commonStyles from '../assets/styles/commonStyles';

const LostConnectionScreen = ({navigation, route}) => {
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
            <Text style={styles.warningText}>
              Vui lòng kiểm tra kết nối mạng
            </Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LostConnectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 18,
    color: 'black',
  },
});
