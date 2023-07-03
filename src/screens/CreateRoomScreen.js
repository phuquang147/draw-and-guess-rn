import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import {useEffect, useState} from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../assets/colors';
import ChatRoomServices from '../services/chatRoomServices';

const CreateRoomScreen = ({navigation, route}) => {
  const [selectedNumber, setSelectedNumber] = useState(10);
  const [selectedPoint, setSelectedPoint] = useState(120);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const {user} = route.params;

  const goBack = () => {
    navigation.navigate('Home');
  };

  const onClose = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    const getTopics = async () => {
      const topicsSnapshot = await firestore().collection('topics').get();
      setTopics(topicsSnapshot.docs.map(topic => topic.data()));
      setSelectedTopic(0);
    };

    getTopics();
  }, []);

  const handleNextTopic = () => {
    setSelectedTopic(prev => prev + 1);
  };

  const handlePrevTopic = () => {
    setSelectedTopic(prev => prev - 1);
  };

  const handleCreateRoom = async () => {
    let uuid = null,
      roomToken = null;
    try {
      const {data, status} = await ChatRoomServices.createRoom();

      if (status === 201) {
        uuid = data.uuid;
        const res = await ChatRoomServices.generateRoomToken(data.uuid);

        if (res.status === 201) {
          roomToken = res.data;
          firestore()
            .collection('rooms')
            .add({
              uuid,
              roomToken,
              maxMember: selectedNumber,
              canJoin: true,
              endPoint: selectedPoint,
              correctCount: 0,
              currentWord: null,
              currentMember: null, // docRef
              state: 'waiting', // waiting | choosing | drawing
              roundCount: 0,
            })
            .then(room => {
              firestore()
                .doc(`users/${user.uid}`)
                .get()
                .then(userSnapshot => {
                  room.collection('members').doc(user.uid).set({
                    isHost: true,
                    isCorrect: false,
                    isDrawing: false,
                    isChoosing: false,
                    isOnline: true,
                    points: 0,
                    name: userSnapshot.data().name,
                    uid: user.uid,
                    photo: userSnapshot.data().photo,
                    roundCount: 0,
                  });

                  const batch = firestore().batch();
                  for (let word of topics[selectedTopic].words) {
                    batch.set(room.collection('words').doc(), {
                      value: word,
                      roundCount: 0,
                    });
                  }
                  batch.commit().then(() => {
                    navigation.navigate('GuessScreen', {roomId: room.id, user});
                  });
                });
            });
        }
      }
    } catch (err) {
      console.log(err);
    }
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
          <View style={styles.avatarContainer}>
            <ThemedButton
              name="bruce"
              type="anchor"
              borderColor="black"
              backgroundDarker="black"
              textFontFamily="icielPony"
              borderRadius={100}
              width={null}
              raiseLevel={5}
              onPress={handlePrevTopic}
              disabled={selectedTopic === 0 || selectedTopic === null}>
              <Icon name="arrow-left" size={24} color="black" />
            </ThemedButton>
            <Image
              style={styles.avatar}
              source={{
                uri:
                  selectedTopic !== null
                    ? topics[selectedTopic].image
                    : 'https://firebasestorage.googleapis.com/v0/b/drawandguessgame.appspot.com/o/null.png?alt=media&token=8201b883-5112-41b4-a96e-ccfd79974ff6',
              }}
            />
            <ThemedButton
              name="bruce"
              type="anchor"
              borderColor="black"
              backgroundDarker="black"
              textFontFamily="icielPony"
              borderRadius={100}
              width={null}
              raiseLevel={5}
              onPress={handleNextTopic}
              disabled={
                selectedTopic === topics.length - 1 || selectedTopic === null
              }>
              <Icon name="arrow-right" size={24} color="black" />
            </ThemedButton>
          </View>
          <View style={styles.pickersContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedNumber}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedNumber(itemValue)
                }
                style={styles.picker}>
                <Picker.Item
                  style={styles.pickerItemText}
                  label="5 Người"
                  value={5}
                />
                <Picker.Item
                  style={styles.pickerItemText}
                  label="10 Người"
                  value={10}
                />
                <Picker.Item
                  style={styles.pickerItemText}
                  label="15 Người"
                  value={15}
                />
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedPoint}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedPoint(itemValue)
                }
                style={styles.picker}>
                <Picker.Item
                  style={styles.pickerItemText}
                  label="100 Điểm"
                  value={100}
                />
                <Picker.Item
                  style={styles.pickerItemText}
                  label="120 Điểm"
                  value={120}
                />
                <Picker.Item
                  style={styles.pickerItemText}
                  label="150 Điểm"
                  value={150}
                />
                <Picker.Item
                  style={styles.pickerItemText}
                  label="180 Điểm"
                  value={180}
                />
              </Picker>
            </View>
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
            onPress={handleCreateRoom}>
            <Text style={styles.text}>Tạo phòng</Text>
          </ThemedButton>
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.pink}
            borderColor="black"
            backgroundDarker="black"
            textFontFamily="icielPony"
            raiseLevel={5}
            style={styles.button}
            onPress={goBack}>
            <Text style={styles.text}>Trở về</Text>
          </ThemedButton>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default CreateRoomScreen;

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
    marginBottom: 20,
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
  picker: {
    flex: 1,
    // marginVertical: 30,
    // marginHorizontal: 20,
    borderWidth: 4,
    borderColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 100,
    fontSize: 24,
  },
  pickerContainer: {
    borderWidth: 4,
    borderRadius: 100,
    overflow: 'hidden',
    width: '60%',
    justifyContent: 'center',
    height: 50,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  pickersContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  pickerItemText: {
    fontSize: 24,
  },
});
