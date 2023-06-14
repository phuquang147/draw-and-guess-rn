import {View, Text, Image, StyleSheet} from 'react-native';

const GameOverRanking = ({players}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game over</Text>
      <View style={styles.ranking}>
        <View style={styles.other}>
          <Image source={{uri: players[1].avatar}} style={styles.avatar} />
          <Text style={styles.name} numberOfLines={1}>
            {players[1].name}
          </Text>
        </View>
        <View style={[styles.other, {alignSelf: 'flex-start'}]}>
          <Image source={{uri: players[0].avatar}} style={styles.avatar} />
          <Text style={styles.name} numberOfLines={1}>
            {players[0].name}
          </Text>
        </View>
        <View style={styles.other}>
          <Image source={{uri: players[2].avatar}} style={styles.avatar} />
          <Text style={styles.name} numberOfLines={1}>
            {players[2].name}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textTransform: 'uppercase',
    fontFamily: 'icielPony',
    marginVertical: 10,
    fontSize: 24,
  },
  ranking: {
    flex: 1,
    flexDirection: 'row',
  },
  name: {
    fontFamily: 'icielPony',
    fontSize: 16
  },
  avatar: {
    width: '60%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  other: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'flex-end'
  },
});

export default GameOverRanking;
