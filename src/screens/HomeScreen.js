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

const HomeScreen = ({navigation, route}) => {
  const {user} = route.params;
  const [showAlert, setShowAlert] = useState('');

  const onCreateRoom = () => {
    navigation.navigate('CreateRoomScreen');
  };

  const onJoinRoom = () => {
    navigation.navigate('JoinRoomScreen');
  };

  const signOut = () => {
    navigation.navigate('ProfileScreen', {userId: user.uid});
  };

  const handleJoinRandomRoom = () => {
    firestore()
      .collection('rooms')
      .where('canJoin', '==', true)
      .where('privacy', '==', 'public')
      .limit(1)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.docs.length > 0) {
          querySnapshot.docs[0].ref
            .collection('members')
            .orderBy('roundCount', 'asc')
            .limit(1)
            .get()
            .then(snapshot => {
              firestore()
                .doc(`users/${user.uid}`)
                .get()
                .then(userSnapshot => {
                  querySnapshot.docs[0].ref
                    .collection('members')
                    .doc(user.uid)
                    .set({
                      isHost: false,
                      isChoosing: false,
                      isCorrect: false,
                      isDrawing: false,
                      isOnline: true,
                      points: 0,
                      name: userSnapshot.data().name,
                      uid: user.uid,
                      photo: userSnapshot.data().photo,
                      roundCount: snapshot.docs[0].data().roundCount,
                    })
                    .then(() => {
                      navigation.navigate('GuessScreen', {
                        roomId: querySnapshot.docs[0].id,
                        user,
                      });
                    });
                });
            });
        } else {
          setShowAlert('Không còn phòng trống! Vui lòng tạo phòng mới');
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require('../assets/images/bg2.jpg')}>
        <View style={styles.header}>
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.red}
            borderColor={colors.darkRed}
            backgroundDarker={colors.darkRed}
            textFontFamily="icielPony"
            borderRadius={100}
            width={null}
            raiseLevel={2}
            paddingHorizontal={18}
            onPress={signOut}>
            <Icon name="user" size={24} color="white" />
          </ThemedButton>
        </View>
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
            backgroundColor={colors.green}
            borderColor={colors.darkGreen}
            backgroundDarker={colors.darkGreen}
            textFontFamily="icielPony"
            textColor={colors.darkGreen}
            raiseLevel={5}
            style={styles.button}
            onPress={handleJoinRandomRoom}>
            <Text style={commonStyles.buttonText}>Bắt đầu</Text>
          </ThemedButton>
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.blue}
            borderColor={colors.darkBlue}
            backgroundDarker={colors.darkBlue}
            textFontFamily="icielPony"
            raiseLevel={5}
            style={styles.button}
            onPress={() => onCreateRoom()}>
            <Text style={commonStyles.buttonText}>Tạo phòng</Text>
          </ThemedButton>
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.yellow}
            borderColor={colors.darkYellow}
            backgroundDarker={colors.darkYellow}
            textFontFamily="icielPony"
            raiseLevel={5}
            style={styles.button}
            onPress={onJoinRoom}>
            <Text style={commonStyles.buttonText}>Tìm kiếm</Text>
          </ThemedButton>
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.pink}
            borderColor={colors.darkPink}
            backgroundDarker={colors.darkPink}
            textFontFamily="icielPony"
            raiseLevel={5}
            style={styles.button}
            onPress={() => {
              navigation.navigate('ManageTopicsScreen', {userId: user.uid});
            }}>
            <Text style={commonStyles.buttonText}>Chủ đề</Text>
          </ThemedButton>
        </View>
      </ImageBackground>
      <AwesomeAlert
        show={!!showAlert}
        showProgress={false}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        onDismiss={() => {
          setShowAlert(false);
        }}
        showConfirmButton={true}
        onConfirmPressed={() => {
          setShowAlert('');
        }}
        confirmText="OK"
        confirmButtonColor={colors.green}
        confirmButtonStyle={{
          paddingHorizontal: 24,
          paddingVertical: 8,
        }}
        confirmButtonTextStyle={{fontSize: 16}}
        customView={
          <View style={styles.alertContainer}>
            <FIcon name="x-circle" size={50} color={colors.red} />
            <Text style={{color: '#555', fontSize: 16, textAlign: 'center'}}>
              {showAlert}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
  },
  avatarContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
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
    marginHorizontal: 10,
    borderWidth: 4,
    borderColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 100,
    fontSize: 24,
  },
  alertContainer: {
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});
