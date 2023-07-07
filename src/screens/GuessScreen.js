/* eslint-disable react/react-in-jsx-scope */
import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {io} from 'socket.io-client';
import {stringSimilarity} from 'string-similarity-js';
import colors from '../assets/colors';
import Answer from '../components/Answer';
import GameOverRanking from '../components/GameOverRanking';
import CountDownProgressBar from '../components/GuessScreen/CountDownProgressBar';
import DrawArea from '../components/GuessScreen/DrawArea';
import ViewDrawArea from '../components/GuessScreen/ViewDrawArea';
import Player from '../components/Player';
import RoomInfoModal from '../components/RoomInfoModal';
import WordSelectionModal from '../components/WordSelectionModal';

const renderDrawArea = (user, room, members) => {
  const [players, setPlayers] = useState([]);
  const [word, setWord] = useState();
  const [currentMemberName, setCurrentMemberName] = useState('');
  const [roomInfoModalVisible, setRoomInfoModalVisible] = useState(false);

  useEffect(() => {
    room?.currentMember
      ?.get()
      .then(value => setCurrentMemberName(value.data().name));
  }, [room?.currentMember]);

  useEffect(() => {
    let unsubscribeWord = () => {};
    if (room?.currentWord) {
      unsubscribeWord = room?.currentWord?.onSnapshot(snapshot => {
        setWord(snapshot.data());
      });
    }
    return () => {
      unsubscribeWord();
    };
  }, [room?.currentWord]);

  useEffect(() => {
    if (room?.state === 'endGame') {
      firestore()
        .collection('rooms')
        .doc(room.id)
        .collection('members')
        .orderBy('points', 'desc')
        .limit(3)
        .get()
        .then(snapshot => {
          setPlayers(snapshot.docs.map(item => item.data()));
          // players.push(snapshot.docs.data())
        });
    }
  }, [room?.state]);

  const handleStartPlaying = async () => {
    firestore().collection('rooms').doc(room.id).update({
      state: 'choosing',
    });
  };

  const handleHint = () => {
    if (room.canHint) {
      room.currentWord?.get().then(value => {
        const word = value.data();

        if (!word.showHint) {
          room.currentWord.update({
            showHint: true,
          });
        } else {
          const hintIndexes = [...word.hintIndexes];

          if (hintIndexes.length < 2) {
            let hintIndex = -1;
            while (hintIndex === -1) {
              const random = Math.floor(Math.random() * word.value.length);

              if (!hintIndexes.includes(random) && word.value[random] !== ' ')
                hintIndex = random;
            }
            hintIndexes.push(hintIndex);
            room.currentWord.update({
              hintIndexes,
            });
          }
        }
      });
    }
  };

  if (user && room) {
    if (room.state === 'waiting') {
      if (user.isHost)
        return (
          <View style={styles.startButtonWrapper}>
            <Pressable
              style={styles.icon}
              onPress={() => {
                setRoomInfoModalVisible(true);
              }}>
              <Ionicon
                name="information-circle-outline"
                color={colors.blue}
                size={32}
              />
            </Pressable>
            <View style={styles.startButton}>
              <ThemedButton
                name="bruce"
                type="anchor"
                backgroundColor={
                  members.length < 2 ? colors.grey : colors.green
                }
                borderColor="black"
                backgroundDarker="black"
                textFontFamily="icielPony"
                raiseLevel={5}
                onPress={handleStartPlaying}
                disabled={members.length < 2}>
                <Text style={styles.buttonText}>Bắt đầu</Text>
              </ThemedButton>
            </View>

            {roomInfoModalVisible && (
              <RoomInfoModal
                room={room}
                onClose={() => setRoomInfoModalVisible(false)}
              />
            )}
          </View>
        );
      else
        return (
          <View style={styles.startButtonWrapper}>
            <Text style={styles.buttonText}>Vui lòng chờ...</Text>
            <Pressable
              style={styles.icon}
              onPress={() => {
                setRoomInfoModalVisible(true);
              }}>
              <Ionicon
                name="information-circle-outline"
                color={colors.blue}
                size={32}
              />
            </Pressable>
            {roomInfoModalVisible && (
              <RoomInfoModal
                room={room}
                onClose={() => setRoomInfoModalVisible(false)}
              />
            )}
          </View>
        );
    } else if (room.state === 'endRound') {
      return (
        <View style={styles.startButtonWrapper}>
          <Text style={styles.buttonText}>{word?.value}</Text>
        </View>
      );
    } else if (room.state === 'skipping') {
      return (
        <View style={styles.startButtonWrapper}>
          <Text
            style={
              styles.buttonText
            }>{`${currentMemberName} đã bỏ lượt ???`}</Text>
        </View>
      );
    } else if (room.state === 'endGame') {
      return (
        <View style={styles.startButtonWrapper}>
          <GameOverRanking players={players} />
        </View>
      );
    } else if (room.state === 'playing') {
      if (user.isDrawing) {
        return (
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                flexWrap: 'wrap',
                zIndex: 1,
              }}>
              {room.currentWord &&
                word.value.split('').map((letter, index) => (
                  <Text
                    style={[
                      styles.buttonText,
                      word.showHint ? {textDecorationLine: 'underline'} : '',
                      word.hintIndexes.includes(index)
                        ? {color: colors.lightGreen}
                        : '',
                    ]}
                    key={`${letter}${Math.random()}`}>
                    {letter}
                  </Text>
                ))}
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
              }}>
              <DrawArea user={user} room={room} />
            </View>
            <View
              style={{position: 'absolute', bottom: 10, left: 10, zIndex: 2}}>
              <ThemedButton
                name="bruce"
                type="anchor"
                textFontFamily="icielPony"
                borderRadius={100}
                width={null}
                onPress={handleHint}
                paddingHorizontal={18}
                disabled={word?.hintIndexes?.length >= 2 || !room?.canHint}
                raiseLevel={2}>
                <Icon name="lightbulb-o" size={30} color="black" />
              </ThemedButton>
            </View>
          </View>
        );
      } else
        return (
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                flexWrap: 'wrap',
                zIndex: 1,
                paddingTop: 4,
              }}>
              {room.currentWord &&
                word?.showHint &&
                word.value.split('').map((letter, index) => (
                  <Text style={styles.text} key={`${letter}${Math.random()}`}>
                    {word.hintIndexes.includes(index) || letter === ' '
                      ? letter
                      : '_'}
                  </Text>
                ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}>
              <View style={{flex: 0.55}}>
                <ViewDrawArea user={user} room={room} />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: 100,
              }}></View>
          </View>
        );
    }
  }

  return null;
};

const GuessScreen = ({navigation, route}) => {
  const {roomId, user} = route.params;
  const [roomInfo, setRoomInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [chats, setChats] = useState([]);
  const [answer, setAnswer] = useState('');
  const [userInRoom, setUserInRoom] = useState(null);

  const [wordSelectionModalVisible, setWordSelectionModalVisible] =
    useState(false);

  useEffect(() => {
    const socket = io('https://draw-and-guess-server-qawt.onrender.com', {
      autoConnect: false,
      query: `userId=${user.uid}&roomId=${roomId}`,
    });

    try {
      socket.connect();
    } catch (err) {
      console.log(err);
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    let unsubscribeRoom = () => {};
    let unsubscribeMembers = () => {};
    let unsubscribeChats = () => {};
    let unsubscribeUser = () => {};

    if (roomId) {
      unsubscribeRoom = firestore()
        .collection('rooms')
        .doc(roomId)
        .onSnapshot(documentSnapshot =>
          setRoomInfo({...documentSnapshot.data(), id: documentSnapshot.id}),
        );

      unsubscribeMembers = firestore()
        .collection('rooms')
        .doc(roomId)
        .collection('members')
        .onSnapshot(querySnapshot => {
          const users = [];
          querySnapshot.forEach(documentSnapshot => {
            users.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });

          setMembers(users);
        });

      unsubscribeChats = firestore()
        .collection('rooms')
        .doc(roomId)
        .collection('answers')
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
          const chats = [];
          querySnapshot.forEach(documentSnapshot => {
            chats.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });

          setChats(chats);
        });

      unsubscribeRoom = firestore()
        .collection('rooms')
        .doc(roomId)
        .collection('members')
        .doc(user.uid)
        .onSnapshot(documentSnapshot => setUserInRoom(documentSnapshot.data()));
    }

    return () => {
      unsubscribeRoom();
      unsubscribeMembers();
      unsubscribeChats();
      unsubscribeUser();
    };
  }, [roomId]);

  useEffect(() => {
    if (userInRoom && userInRoom.isChoosing) setWordSelectionModalVisible(true);

    // return () => {
    //   console.log(userInRoom);
    //   if (userInRoom && userInRoom?.isHost)
    //     firestore()
    //       .collection('rooms')
    //       .doc(roomId)
    //       .collection('members')
    //       .where('uid', '!=', userInRoom.uid)
    //       .limit(1)
    //       .get(snapshot => {
    //         console.log(snapshot.docs);
    //         snapshot.docs[0].ref.update({isHost: true});
    //       });

    //   firestore()
    //     .collection('rooms')
    //     .doc(roomId)
    //     .collection('members')
    //     .doc(user.uid)
    //     .delete();
    // };
  }, [userInRoom]);

  const handleSkip = () => {
    firestore()
      .collection('rooms')
      .doc(roomId)
      .collection('members')
      .doc(userInRoom.uid)
      .update({isChoosing: false});
    firestore().collection('rooms').doc(roomId).update({state: 'skipping'});
    setWordSelectionModalVisible(false);
  };

  const handleDraw = () => {
    firestore()
      .collection('rooms')
      .doc(roomId)
      .collection('members')
      .doc(userInRoom.uid)
      .update({isChoosing: false, isDrawing: true});
    firestore().collection('rooms').doc(roomId).update({state: 'playing'});
    setWordSelectionModalVisible(false);
  };

  const handleSendMessage = () => {
    let status = 'wrong';
    roomInfo.currentWord.get().then(async value => {
      if (roomInfo.currentWord) {
        if (
          stringSimilarity(
            value.data().value.toLowerCase(),
            answer.toLowerCase(),
          ) === 1
        )
          status = 'correct';
        else if (
          stringSimilarity(
            value.data().value.toLowerCase(),
            answer.toLowerCase(),
          ) >= 0.5
        )
          status = 'almost';
      }

      if (answer.trim().length > 0)
        await firestore()
          .collection('rooms')
          .doc(roomId)
          .collection('answers')
          .add({
            uid: user.uid,
            name: user.displayName,
            answer: answer,
            createdAt: new Date(),
            status, // wrong | almost | correct
          })
          .then(() => {
            setAnswer('');
          });

      if (status === 'correct') {
        await roomInfo.currentMember.update({
          points: firestore.FieldValue.increment(
            roomInfo.correctCount === 0 ? 11 : 2,
          ),
        });

        await firestore()
          .collection('rooms')
          .doc(roomId)
          .collection('members')
          .doc(user.uid)
          .update({
            isCorrect: true,
            points: firestore.FieldValue.increment(
              roomInfo.correctCount < 8 ? 10 - roomInfo.correctCount : 2,
            ),
          });

        await firestore()
          .collection('rooms')
          .doc(roomId)
          .update({
            correctCount: firestore.FieldValue.increment(1),
          });
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.drawContainer,
          roomInfo?.state === 'waiting' || roomInfo?.state === 'choosing'
            ? {marginBottom: 32}
            : '',
          userInRoom?.isDrawing
            ? {
                flex: 1,
              }
            : '',
        ]}>
        <View
          style={[
            styles.draw,
            userInRoom?.isDrawing
              ? {
                  flexDirection: 'column',
                }
              : {flexDirection: 'row', justifyContent: 'center'},
          ]}>
          {renderDrawArea(userInRoom, roomInfo, members)}
        </View>
        {/* <View style={styles.tools}>
          <Ionicon name="settings-outline" size={28} color="#4cdafe" />
          <Feathericon name="alert-triangle" size={28} color="#cc0000" />
          <Ionicon
            name="information-circle-outline"
            size={28}
            color="#4cdafe"
          />
        </View> */}
      </View>

      <View>
        {roomInfo?.state &&
          roomInfo?.state !== 'waiting' &&
          roomInfo?.state !== 'choosing' && (
            <CountDownProgressBar
              roomId={roomId}
              roundCount={roomInfo?.roundCount}
              state={roomInfo?.state}
            />
          )}
      </View>
      {!userInRoom?.isDrawing && (
        <View style={styles.chatContainer}>
          <View style={styles.players}>
            <FlatList
              style={styles.playerList}
              data={members}
              renderItem={({item}) => <Player player={item} />}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={() => <View style={{height: 16}}></View>}
            />
          </View>
          <View style={styles.chat}>
            <FlatList
              style={styles.chatList}
              data={chats}
              inverted={true}
              renderItem={({item}) => <Answer answer={item} />}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={() => <View style={{height: 6}}></View>}
            />
            <View
              style={[
                styles.inputContainer,
                roomInfo &&
                roomInfo.state === 'playing' &&
                userInRoom &&
                !userInRoom.isCorrect &&
                !userInRoom.isDrawing
                  ? ''
                  : {backgroundColor: colors.grey},
              ]}>
              <TextInput
                style={styles.input}
                placeholder={
                  roomInfo && roomInfo.state === 'playing'
                    ? 'Nhập câu trả lời'
                    : 'Vui lòng chờ...'
                }
                placeholderTextColor={colors.darkGrey}
                value={answer}
                onChangeText={value => setAnswer(value)}
                onEndEditing={handleSendMessage}
                editable={
                  roomInfo &&
                  roomInfo.state === 'playing' &&
                  userInRoom &&
                  !userInRoom.isCorrect &&
                  !userInRoom.isDrawing
                }
              />
              <Pressable
                onPress={handleSendMessage}
                disabled={
                  (roomInfo && roomInfo.state !== 'playing') ||
                  (userInRoom && userInRoom.isCorrect)
                }
                android_ripple={{color: '#84accc', radius: 10}}>
                <Icon
                  name="send"
                  color={
                    (roomInfo && roomInfo.state !== 'playing') ||
                    (userInRoom && userInRoom.isCorrect)
                      ? colors.darkGrey
                      : '#7b54ff'
                  }
                  size={20}
                />
              </Pressable>
            </View>
          </View>
        </View>
      )}
      {roomInfo?.currentWord && wordSelectionModalVisible && (
        <WordSelectionModal
          wordRef={roomInfo?.currentWord}
          onDraw={handleDraw}
          onSkip={handleSkip}
        />
      )}
    </SafeAreaView>
  );
};

export default GuessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7b53ff',
    padding: 5,
    paddingBottom: 15,
    flexDirection: 'column',
  },
  drawContainer: {
    position: 'relative',
    flex: 0.5,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  draw: {
    // position: 'absolute',
    width: '100%',
    height: '100%',
  },
  tools: {
    position: 'absolute',
    display: 'flex',
    gap: 12,
    alignSelf: 'flex-start',
    top: 12,
    right: 12,
  },
  chatContainer: {
    flex: 0.6,
    flexDirection: 'row',
  },
  playerList: {
    backgroundColor: '#7b53ff',
  },
  players: {
    flex: 0.44,
  },
  chat: {
    flex: 0.56,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  chatList: {
    flex: 1,
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a4a4a4',
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 5,
    color: '#a4a4a4',
  },
  startButtonWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  buttonText: {
    fontFamily: 'icielPony',
    fontSize: 30,
    color: '#333',
  },
  waitingText: {
    fontSize: 18,
  },
  text: {
    fontFamily: 'icielPony',
    color: '#333',
    fontSize: 20,
  },
  startButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
});
