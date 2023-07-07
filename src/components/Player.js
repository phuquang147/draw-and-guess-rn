import {Image, StyleSheet, Text, View} from 'react-native';
import colors from '../assets/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Player = ({player}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: player.photo}} style={styles.avatar}></Image>
      {player.isDrawing && (
        <Icon
          style={styles.icon}
          name="pencil"
          size={24}
          color={colors.darkGreen}
        />
      )}
      {player.isCorrect && (
        <Icon
          style={styles.icon}
          name="check"
          size={24}
          color={colors.darkGreen}
        />
      )}
      <View style={styles.info}>
        <Text style={styles.content} numberOfLines={1}>
          {player.name}
        </Text>
        <Text style={styles.points} numberOfLines={1}>
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
    marginBottom: 2,
  },
  avatar: {
    flex: 0.3,
    height: '80%',
    aspectRatio: 1,
    borderRadius: 100,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  info: {
    flex: 0.7,
  },
  content: {
    fontFamily: 'icielPony',
    fontSize: 16,
    color: '#fff',
  },
  points: {
    fontSize: 16,
    color: '#fff',
  },
  icon: {
    position: 'absolute',
    left: '20%',
    bottom: -4,
    zIndex: 100,
  },
});

export default Player;
