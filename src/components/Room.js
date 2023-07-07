import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../assets/colors';

const Room = ({room, onJoinRoom}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: room.topicThumbnail}} style={styles.avatar} />
      <View style={styles.infor}>
        <Text style={[styles.content, {fontWeight: 700}]}>
          Chủ đề: {room.topicName}
        </Text>
        <Text style={styles.content}>
          {room.currentMembers}/{room.maxMember}
        </Text>
        <Text style={styles.content}>Điểm kết thúc: {room.endPoint}</Text>
      </View>

      <Pressable
        style={[
          styles.icon,
          !room.canJoin
            ? {borderColor: colors.darkGrey, backgroundColor: colors.grey}
            : {borderColor: colors.darkBlue, backgroundColor: colors.lightBlue},
        ]}
        onPress={() => onJoinRoom(room.id)}
        disabled={!room.canJoin}
        android_ripple={{color: '#84accc', radius: 20}}>
        <Icon
          name="enter"
          color={!room.canJoin ? colors.darkGrey : colors.darkBlue}
          size={24}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: 'white',
  },
  infor: {
    flex: 1,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
  },
  avatar: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.grey,
    alignSelf: 'center',
  },
});

export default Room;
