import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  FlatList,
} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../assets/colors';
import Room from '../components/Room';
import Icon from 'react-native-vector-icons/FontAwesome';

const JoinRoomScreen = ({navigation, route}) => {
  const [id, setId] = useState('');
  const {user} = route.params;
  const [rooms, setRooms] = useState([]);

  const onClose = () => {
    navigation.navigate('Home');
  };

  useEffect(async () => {
    firestore()
      .collection('rooms')
      .get()
      .then(async querySnapshot => {
        const tempRooms = [];
        for(let room of querySnapshot.docs) {
          await room.ref
            .collection('members')
            .count()
            .get()
            .then(snapshot =>
              tempRooms.push({
                ...room.data(),
                id: room.id,
                currentMembers: snapshot.data().count,
              }),
            );
        }
        setRooms(tempRooms);
      });
  }, []);

  const handleJoinRoom = id => {
    firestore()
      .collection('rooms')
      .doc(id)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.exists) {
          querySnapshot.ref
            .collection('members')
            .orderBy('roundCount', 'asc')
            .limit(1)
            .get()
            .then(snapshot => {
              firestore()
                .doc(`users/${user.uid}`)
                .get()
                .then(userSnapshot => {
                  querySnapshot.ref
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
                        roomId: id,
                        user,
                      });
                    });
                });
            });
        } else {
          Alert.alert('Không tìm thấy phòng! Vui lòng kiểm tra lại.');
        }
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
            onPress={onClose}>
            <Icon name="close" size={24} color="white" />
          </ThemedButton>
        </View>
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder={'Nhập ID phòng'}
            value={id}
            onChangeText={value => setId(value)}
          />
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.blue}
            borderColor="black"
            backgroundDarker="black"
            textFontFamily="icielPony"
            raiseLevel={5}
            onPress={() => handleJoinRoom(id)}>
            <Text style={styles.text}>Tham gia</Text>
          </ThemedButton>
          <FlatList
            style={styles.flatList}
            data={rooms}
            renderItem={({item}) => (
              <Room room={item} onJoinRoom={handleJoinRoom} />
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => <View />}
            ItemSeparatorComponent={<View style={[{height: 12}]}/>}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default JoinRoomScreen;

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
    gap: 10,
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
  joinRoomView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
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
    width: '80%',
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
  flatList: {
    flex: 1,
    width: "90%"
  },
});
