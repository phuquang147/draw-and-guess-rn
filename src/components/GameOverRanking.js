import {View, Text, Image, StyleSheet} from 'react-native';

const GameOverRanking = ({players}) => {
  console.log(players)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game over</Text>
      <View style={styles.ranking}>
        <View style={styles.other}>
          <View style={styles.avatarContainer}>
            <Image source={{uri: players?.[1]?.photo}} style={styles.avatar} />
            <Image
              source={require('../assets/images/top2.png')}
              style={styles.medal}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {players?.[1]?.name}
          </Text>
        </View>
        <View style={[styles.other, {alignSelf: 'flex-start'}]}>
          <View>
            <Image source={{uri: players?.[0]?.photo}} style={styles.avatar} />
            <Image
              source={require('../assets/images/top1.png')}
              style={styles.medal}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {players?.[0]?.name}
          </Text>
        </View>
        <View style={styles.other}>
          <View>
            <Image source={{uri: players?.[2]?.photo}} style={styles.avatar} />
            <Image
              source={players?.[2] ?  require('../assets/images/top3.png') : ""}
              style={styles.medal}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {players?.[2]?.name}
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
    fontSize: 16,
  },
  avatar: {
    width: '75%',
    aspectRatio: 1,
    borderRadius: 100,
    alignSelf: 'center',
  },
  other: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 30,
  },
  avatarContainer: {
    position: 'relative',
  },
  medal: {
    width: 50,
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
  },
});

export default GameOverRanking;
