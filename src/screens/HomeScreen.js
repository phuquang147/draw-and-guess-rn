import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../assets/colors';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

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
            .doc(user.uid)
            .set({
              isHost: false,
              isChoosing: false,
              isCorrect: false,
              isDrawing: false,
              points: 0,
              name: user.displayName,
              uid: user.uid,
              photo: user.photoURL,
              roundCount: querySnapshot.docs[0].data().round - 1,
            })
            .then(() => {
              navigation.navigate('GuessScreen', {
                roomId: querySnapshot.docs[0].id,
                user,
              });
            });
        } else Alert.alert('Không còn phòng trống! Vui lòng tạo phòng mới');
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
            raiseLevel={5}
            onPress={signOut}>
            <Icon name="user" size={24} color="white" />
          </ThemedButton>
        </View>
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <ThemedButton
              name="bruce"
              type="anchor"
              borderColor="black"
              backgroundDarker="black"
              textFontFamily="icielPony"
              borderRadius={100}
              width={null}
              raiseLevel={5}>
              <Icon name="arrow-left" size={24} color="black" />
            </ThemedButton>
            <Image
              style={styles.avatar}
              source={require('../assets/images/splash.png')}
            />
            <ThemedButton
              name="bruce"
              type="anchor"
              borderColor="black"
              backgroundDarker="black"
              textFontFamily="icielPony"
              borderRadius={100}
              width={null}
              raiseLevel={5}>
              <Icon name="arrow-right" size={24} color="black" />
            </ThemedButton>
          </View>

          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.green}
            borderColor="black"
            backgroundDarker="black"
            textFontFamily="icielPony"
            raiseLevel={5}
            style={styles.button}
            onPress={handleJoinRandomRoom}>
            <Text style={styles.text}>Bắt đầu</Text>
          </ThemedButton>
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.blue}
            borderColor="black"
            backgroundDarker="black"
            textFontFamily="icielPony"
            raiseLevel={5}
            style={styles.button}
            onPress={() => onCreateRoom()}>
            <Text style={styles.text}>Tạo phòng</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'icielPony',
    fontSize: 30,
    color: '#333',
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
    marginVertical: 30,
    marginHorizontal: 20,
    borderWidth: 4,
    borderColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 100,
    fontSize: 24,
  },
});
