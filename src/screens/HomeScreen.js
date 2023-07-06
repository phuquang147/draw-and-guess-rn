import firestore from '@react-native-firebase/firestore';
import {Alert, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../assets/colors';
import commonStyles from '../assets/styles/commonStyles';

const HomeScreen = ({navigation, route}) => {
  const {user} = route.params;
  const onCreateRoom = () => {
    navigation.navigate('CreateRoomScreen');
  };

  const signOut = () => {
    navigation.navigate('ProfileScreen', {userId: user.uid});
  };

  const handleJoinRandomRoom = () => {
    firestore()
      .collection('rooms')
      .where('canJoin', '==', true)
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
                  console.log(userSnapshot.data());
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
                      console.log('Asss');
                      navigation.navigate('GuessScreen', {
                        roomId: querySnapshot.docs[0].id,
                        user,
                      });
                    });
                });
            });
        } else Alert.alert('Không còn phòng trống! Vui lòng tạo phòng mới');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require('../assets/images/bg.jpg')}>
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
            raiseLevel={5}
            onPress={signOut}>
            <Icon name="user" size={24} color="white" />
          </ThemedButton>
        </View>
        <View style={styles.content}>
          {/* <View style={styles.logoContainer}>
            <View style={styles.logoOverlay}></View>
            <Image
              style={styles.logo}
              source={require('../assets/images/splash.png')}
            />
          </View> */}
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
    width: 200,
    height: 200,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    opacity: 0.5,
    borderRadius: 100,
    borderColor: colors.blue,
    borderWidth: 1,
  },
  logo: {
    height: 160,
    width: 160,
    resizeMode: 'contain',
    zIndex: 10,
  },
  header: {
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
  button: {
    marginTop: 16,
  },
});
