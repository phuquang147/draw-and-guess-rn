import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import {useEffect, useState, useContext} from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../assets/colors';
import ChatRoomServices from '../services/chatRoomServices';
import BackButton from '../components/BackButton';
import commonStyles from '../assets/styles/commonStyles';
import {UserContext} from '../../App';

const CreateRoomScreen = ({navigation, route}) => {
  const [selectedNumber, setSelectedNumber] = useState(10);
  const [selectedPoint, setSelectedPoint] = useState(120);
  const [selectedPrivacy, setSelectedPrivacy] = useState('private');

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const {user} = useContext(UserContext);

  const goBack = () => {
    navigation.navigate('Home');
  };

  const onClose = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    const getTopics = async () => {
      const topicsSnapshot = await firestore().collection('topics').get();
      setTopics(
        topicsSnapshot.docs
          .map(topic => topic.data())
          .filter(
            topic =>
              topic.author === 'admin' ||
              topic.author === user.uid ||
              (topic.privacy === 'public' && topic.state === 'accepted'),
          ),
      );
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
              topicName: topics[selectedTopic].name,
              topicThumbnail: topics[selectedTopic].image,
              correctCount: 0,
              currentWord: null,
              currentMember: null, // docRef
              state: 'waiting', // waiting | choosing | drawing
              roundCount: 0,
              canHint: true,
              privacy: selectedPrivacy,
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
                      showHint: false,
                      hintIndexes: [],
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
        source={require('../assets/images/bg.jpg')}>
        <View style={styles.header}>
          <BackButton goBackKey="HomeScreen" />
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
              raiseLevel={2}
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
              raiseLevel={2}
              onPress={handleNextTopic}
              disabled={
                selectedTopic === topics.length - 1 || selectedTopic === null
              }>
              <Icon name="arrow-right" size={24} color="black" />
            </ThemedButton>
          </View>
          <Text style={[styles.text, {fontSize: 24, marginTop: 4}]}>
            {topics[selectedTopic]?.name}
          </Text>
          <View style={styles.pickersContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedNumber}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedNumber(itemValue)
                }
                style={styles.picker}
                dropdownIconColor={colors.grey}>
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
                style={styles.picker}
                dropdownIconColor={colors.grey}>
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
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedPrivacy}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedPrivacy(itemValue)
                }
                style={styles.picker}
                dropdownIconColor={colors.grey}>
                <Picker.Item
                  style={styles.pickerItemText}
                  label="Riêng tư"
                  value="private"
                />
                <Picker.Item
                  style={styles.pickerItemText}
                  label="Công khai"
                  value="public"
                />
              </Picker>
            </View>
          </View>

          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.green}
            borderColor={colors.darkGreen}
            backgroundDarker={colors.darkGreen}
            textFontFamily="icielPony"
            raiseLevel={5}
            style={styles.button}
            onPress={handleCreateRoom}>
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
            onPress={goBack}>
            <Text style={commonStyles.buttonText}>Trở về</Text>
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
    marginBottom: 10,
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
    borderWidth: 1,
    borderColor: '#999',
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    color: 'black',
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 8,
    fontSize: 20,
  },
  pickerContainer: {
    color: 'black',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    width: '60%',
    justifyContent: 'center',
    height: 50,
    marginVertical: 6,
    marginHorizontal: 20,
  },
  pickersContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  pickerItemText: {
    fontSize: 20,
  },
});
