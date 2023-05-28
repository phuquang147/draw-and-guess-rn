import {View, StyleSheet, FlatList, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Feathericon from 'react-native-vector-icons/Feather';
import Player from '../components/Player'
import CorrectAnswer from '../components/CorrectAnswer';
import AlmostCorrectAnswer from '../components/AlmostCorrectAnswer';
import Answer from '../components/Answer';
import { useState } from 'react';
import GameOverRanking from '../components/GameOverRanking';

const playerData = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Quangu',
    score: 2,
    avatar: 'https://www.w3schools.com/w3images/avatar6.png',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'Tứn Cùi',
    score: 5,
    avatar: 'https://www.w3schools.com/w3images/avatar2.png',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Em Nghĩa vjp pro',
    score: 16,
    avatar:
      'https://static.wikia.nocookie.net/tdsfanmade/images/e/e6/GigaChad.jpg/revision/latest?cb=20220504152300',
  },
];

const chatData = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28b',
    playerName: 'Quangu',
    answer: 'Báo đốm',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f6',
    playerName: 'Tứn Cùi',
    answer: 'Báo đen',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d7',
    playerName: 'Em Nghĩa vjp pro',
    answer: 'Báo đời',
  },
  {
    id: 'bd7acbe-c1b1-46c2-aed5-3ad53abb28b',
    playerName: 'Quangu',
    answer: 'Báo đốm',
  },
  {
    id: '3ac68af-c605-48d3-a4f8-fbd91aa97f6',
    playerName: 'Tứn Cùi',
    answer: 'Báo đen',
  },
  {
    id: '58694a0-3da1-471f-bd96-145571e29d7',
    playerName: 'Em Nghĩa vjp pro',
    answer: 'Báo đời',
  },
  {
    id: 'bd7acea-c1b1-46c2-aed5-3ad53abb28b',
    playerName: 'Quangu',
    answer: 'Báo đốm',
  },
  {
    id: '3ac68fc-c605-48d3-a4f8-fbd91aa97f6',
    playerName: 'Tứn Cùi',
    answer: 'Báo đen',
  },
  {
    id: '586940f-3da1-471f-bd96-145571e29d7',
    playerName: 'Em Nghĩa vjp pro',
    answer: 'Báo đời',
  },
  {
    id: 'bd7abea-c1b1-46c2-aed5-3ad53abb28b',
    playerName: 'Quangu',
    answer: 'Báo đốm',
  },
  {
    id: '3ac6afc-c605-48d3-a4f8-fbd91aa97f6',
    playerName: 'Tứn Cùi',
    answer: 'Báo đen',
  },
  {
    id: '5869a0f-3da1-471f-bd96-145571e29d7',
    playerName: 'Em Nghĩa vjp pro',
    answer: 'Báo đời',
  },
  {
    id: 'bd7cbea-c1b1-46c2-aed5-3ad53abb28b',
    playerName: 'Quangu',
    answer: 'Báo đốm',
  },
  {
    id: '3ac8afc-c605-48d3-a4f8-fbd91aa97f6',
    playerName: 'Tứn Cùi',
    answer: 'Báo đen',
  },
  {
    id: '5864a0f-3da1-471f-bd96-145571e29d7',
    playerName: 'Em Nghĩa vjp pro',
    answer: 'Báo đời',
  },
  {
    id: 'bdacbea-c1b1-46c2-aed5-3ad53abb28b',
    playerName: 'Quangu',
    answer: 'Báo đốm',
  },
  {
    id: '3a68afc-c605-48d3-a4f8-fbd91aa97f6',
    playerName: 'Tứn Cùi',
    answer: 'Báo đen',
  },
  {
    id: '5894a0f-3da1-471f-bd96-145571e29d7',
    playerName: 'Em Nghĩa vjp pro',
    answer: 'Báo đời',
  },
  {
    id: 'b7acbea-c1b1-46c2-aed5-3ad53abb28b',
    playerName: 'Quangu',
    answer: 'Báo đốm',
  },
  {
    id: '3c68afc-c605-48d3-a4f8-fbd91aa97f6',
    playerName: 'Tứn Cùi',
    answer: 'Báo đen',
  },
  {
    id: '5694a0f-3da1-471f-bd96-145571e29d7',
    playerName: 'Em Nghĩa vjp pro',
    answer: 'Báo đời',
  },
];

const GuessScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.drawContainer}>
        <View style={styles.draw}>
          <GameOverRanking players={playerData}/>
        </View>
        <View style={styles.tools}>
          <Ionicon name="settings-outline" size={28} color="#4cdafe" />
          <Feathericon
            name="alert-triangle"
            size={28}
            color="#cc0000"
          />
          <Ionicon
            name="information-circle-outline"
            size={28}
            color="#4cdafe"
          />
        </View>
      </View>

      <Progress.Bar
        progress={0.7}
        style={styles.progress}
        animationType="timing"
        height={100}
        borderRadius={20}
        borderColor="#fff"
        color="#fc8aff"
        unfilledColor="#6d45e7"
        width={null}
      />
      <View style={styles.chatContainer}>
        <View style={styles.players}>
          <FlatList
            style={styles.playerList}
            data={playerData}
            renderItem={({item}) => <Player player={item} />}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={{height: 16}}></View>}
          />
        </View>
        <View style={styles.chat}>
          <FlatList
            style={styles.chatList}
            data={chatData}
            inverted={true}
            renderItem={({item}) => <Answer chat={item} />}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={{height: 6}}></View>}
          />
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Nhập câu trả lời" />
            <Icon name="send" color="#7b54ff" size={20} />
          </View>
        </View>
      </View>
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
    flex: 0.36,
  },
  draw: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  tools: {
    display: 'flex',
    gap: 12,
    alignSelf: 'flex-start',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  progress: {
    flex: 0.04,
    marginVertical: 8,
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
});
