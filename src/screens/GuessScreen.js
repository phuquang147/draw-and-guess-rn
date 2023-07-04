/* eslint-disable react/react-in-jsx-scope */
import {FastRoom, WhiteboardView} from '@netless/react-native-fastboard';
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
import Feathericon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {stringSimilarity} from 'string-similarity-js';
import colors from '../assets/colors';
import Answer from '../components/Answer';
import GameOverRanking from '../components/GameOverRanking';
import CountDownProgressBar from '../components/GuessScreen/CountDownProgressBar';
import Player from '../components/Player';
import WordSelectionModal from '../components/WordSelectionModal';
import {io} from 'socket.io-client';

const renderDrawArea = (user, room, members) => {
  const [players, setPlayers] = useState([]);
  const [keyWord, setKeyWord] = useState('');
  const [currentMemberName, setCurrentMemberName] = useState('');

  const drawingBoard = value => {
    value.room.cleanScene(true);
  };

  useEffect(() => {
    room?.currentMember
      ?.get()
      .then(value => setCurrentMemberName(value.data().name));
  }, [room?.currentMember]);

  useEffect(() => {
    room?.currentWord?.get().then(value => setKeyWord(value.data().value));
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

  if (user && room) {
    if (room.state === 'waiting') {
      if (user.isHost)
        return (
          <View style={styles.startButtonWrapper}>
            <ThemedButton
              name="bruce"
              type="anchor"
              backgroundColor={members.length < 2 ? colors.grey : colors.green}
              borderColor="black"
              backgroundDarker="black"
              textFontFamily="icielPony"
              raiseLevel={5}
              onPress={handleStartPlaying}
              disabled={members.length < 2}>
              <Text style={styles.buttonText}>Bắt đầu</Text>
            </ThemedButton>
          </View>
        );
      else
        return (
          <View style={styles.startButtonWrapper}>
            <Text style={styles.waitingText}>Vui lòng chờ...</Text>
          </View>
        );
    }
    if (room.state === 'endRound') {
      return (
        <View style={styles.startButtonWrapper}>
          <Text style={styles.buttonText}>{keyWord}</Text>
        </View>
      );
    }
    if (room.state === 'skipping') {
      return (
        <View style={styles.startButtonWrapper}>
          <Text
            style={
              styles.buttonText
            }>{`${currentMemberName} đã bỏ lượt ???`}</Text>
        </View>
      );
    }
    if (room.state === 'endGame') {
      return (
        <View style={styles.startButtonWrapper}>
          <GameOverRanking players={players} />
        </View>
      );
    } else {
      if (user.isDrawing) {
        return (
          <View style={{flex: 1}}>
            <Text style={[styles.buttonText, {textAlign: 'center', py: 4}]}>
              {keyWord}
            </Text>
            <FastRoom
              sdkParams={{
                appIdentifier: 'lt740PLeEe2rGsedTfSCvw/1fgYEXBhcn-BTw',
                region: 'sg',
              }}
              roomParams={{
                uid: user.uid,
                uuid: room.uuid,
                roomToken: room.roomToken,
              }}
              style={styles.canvas}
              joinRoomSuccessCallback={FastRoomObject =>
                drawingBoard(FastRoomObject)
              }
            />
          </View>
        );
      } else
        return (
          <View style={{flex: 0.45}}>
            <FastRoom
              sdkParams={{
                appIdentifier: 'lt740PLeEe2rGsedTfSCvw/1fgYEXBhcn-BTw',
                region: 'sg',
              }}
              roomParams={{
                uid: user.uid,
                uuid: room.uuid,
                roomToken: room.roomToken,
              }}
              style={styles.guessCanvas}
              displayConfig={{
                showApplianceTools: false,
                showRedoUndo: false,
                showPageIndicator: false,
              }}
            />
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
    const socket = io('http://192.168.1.9:3000', {
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
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={
                  roomInfo && roomInfo.state === 'playing'
                    ? 'Nhập câu trả lời'
                    : 'Vui lòng chờ...'
                }
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
                  (roomInfo && roomInfo.state === 'waiting') ||
                  (userInRoom && userInRoom.isCorrect)
                }>
                <Icon name="send" color="#7b54ff" size={20} />
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
    flex: 0.4,
  },
  draw: {
    // position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#fff',
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
    borderRadius: 20,
    padding: 10,
  },
  chatList: {
    flex: 1,
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 2,
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
  },
  buttonText: {
    fontFamily: 'icielPony',
    fontSize: 30,
    color: '#333',
  },
  canvas: {
    flex: 1,
    container: {
      flex: 1,
    },
  },
  guessCanvas: {
    flex: 1,
    container: {
      flex: 1,
    },
  },
  waitingText: {
    fontSize: 18,
  },
});
