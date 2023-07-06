import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import colors from '../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const Room = ({room, onJoinRoom}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: room.topicThumbnail}} style={styles.avatar} />
      <View style={styles.infor}>
        <Text style={styles.content}>
          Chủ đề: {room.topicName}
        </Text>
        <Text style={styles.content}>
          {room.currentMembers}/{room.maxMember}
        </Text>
        <Text style={styles.content}>Điểm kết thúc: {room.endPoints}</Text>
      </View>

      <Pressable style={styles.icon}>
        <Icon name='enter' color={colors.blue} size={40}/>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    gap: 8
  },
  infor: {
    flex: 1,
  },
  content: {
    fontFamily: 'icielPony',
    fontSize: 16,
    color: '#333',
  },
  text: {
    fontFamily: 'icielPony',
    fontSize: 20,
    color: '#333',
  },
  icon: {
    
  },
  avatar: {
    width: '20%',
    aspectRatio: 1,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.primary,
    alignSelf: 'center',
  },
});

export default Room;
