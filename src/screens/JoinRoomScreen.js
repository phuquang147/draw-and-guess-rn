import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import FIcon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';
import colors from '../assets/colors';
import commonStyles from '../assets/styles/commonStyles';
import BackButton from '../components/BackButton';
import DashedLine from '../components/DashedLine';
import EmptyList from '../components/EmptyList';
import Loading from '../components/Loading';
import Room from '../components/Room';
import ShadowWrapper from '../components/ShadowWrapper';

const JoinRoomScreen = ({navigation, route}) => {
  const [id, setId] = useState('');
  const {user} = route.params;
  const [rooms, setRooms] = useState([]);
  const [showAlert, setShowAlert] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRooms = () => {
      firestore()
        .collection('rooms')
        .where('privacy', '==', 'public')
        .onSnapshot(async querySnapshot => {
          const tempRooms = [];
          for (let room of querySnapshot.docs) {
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
          setLoading(false);
        });
    };

    getRooms();
  }, []);

  const handleJoinRoom = id => {
    firestore()
      .collection('rooms')
      .doc(id)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.exists) {
          if (querySnapshot.data().canJoin) {
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
            setShowAlert('Phòng đã đầy!');
          }
        } else {
          setShowAlert('Không tìm thấy phòng! Vui lòng kiểm tra lại.');
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require('../assets/images/bg.jpg')}>
        <View style={styles.header}>
          <BackButton goBackKey="HomeScreen" />
        </View>
        <View style={styles.content}>
          <View style={styles.joinRoomContainer}>
            <TextInput
              style={commonStyles.input}
              value={id}
              onChangeText={value => setId(value)}
              placeholder="ID phòng"
              placeholderTextColor="#bbb"
            />
            <ThemedButton
              name="bruce"
              type="anchor"
              backgroundColor={colors.green}
              borderColor={colors.darkGreen}
              backgroundDarker={colors.darkGreen}
              textFontFamily="icielPony"
              raiseLevel={2}
              height={50}
              width={50}
              paddingHorizontal={0}
              onPress={() => handleJoinRoom(id)}>
              <IonIcon name="enter" size={24} color="white" />
            </ThemedButton>
          </View>
          {loading ? (
            <ShadowWrapper>
              <Loading />
            </ShadowWrapper>
          ) : (
            <ShadowWrapper>
              {rooms.length > 0 ? (
                <FlatList
                  style={styles.flatList}
                  data={rooms}
                  renderItem={({item}) => (
                    <Room room={item} onJoinRoom={handleJoinRoom} />
                  )}
                  keyExtractor={item => item.id}
                  ListEmptyComponent={() => <View />}
                  ItemSeparatorComponent={<DashedLine />}
                />
              ) : (
                <EmptyList
                  image={require('../assets/images/emptyroom.png')}
                  title={'Chả có phòng nào :)'}
                />
              )}
            </ShadowWrapper>
          )}
        </View>
      </ImageBackground>
      <AwesomeAlert
        show={!!showAlert}
        showProgress={false}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        onDismiss={() => {
          setShowAlert('');
        }}
        contentContainerStyle={{borderRadius: 8}}
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
          <View style={commonStyles.alertContainer}>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    width: '100%',
    backgroundColor: 'white',
  },
  joinRoomContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
