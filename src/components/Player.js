import {Image, StyleSheet, Text, View} from 'react-native';

const Player = ({player}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: player.photo}} style={styles.avatar} />
      <View style={styles.infor}>
        <Text style={styles.content} numberOfLines={1}>
          {player.name}
        </Text>
        <Text style={styles.content} numberOfLines={1}>
          {player.points} điểm
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  avatar: {
    flex: 0.3,
    height: '80%',
    aspectRatio: 1,
    borderRadius: 100,
    marginHorizontal: 6,
  },
  infor: {
    flex: 0.7,
  },
  content: {
    fontFamily: 'icielPony',
    fontSize: 16,
    color: '#fff',
  },
});

export default Player;
