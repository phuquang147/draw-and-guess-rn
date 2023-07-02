import {firebase} from '@react-native-firebase/database';
import {useEffect, useState} from 'react';
import * as Progress from 'react-native-progress';
import {StyleSheet} from 'react-native';

const CountDownProgressBar = ({roomId, roundCount, state}) => {
  const [countDown, setCountDown] = useState(
    state === 'playing' ? 120000 : state === 'endRound' ? 10000 : 15000,
  );

  useEffect(() => {
    let refPath;
    let onValueChange;

    if (state === 'playing') {
      refPath = `/rooms/${roomId}-${roundCount}`;
      onValueChange = snapshot => {
        if (snapshot.val()) setCountDown(snapshot.val().remaining);
      };
    } else if (state === 'endRound') {
      refPath = `/rooms/${roomId}-endRound`;
      onValueChange = snapshot => {
        if (snapshot.val()) setCountDown(snapshot.val().remaining);
      };
    } else {
      refPath = `/rooms/${roomId}-endGame`;
      onValueChange = snapshot => {
        if (snapshot.val()) setCountDown(snapshot.val().remaining);
      };
    }

    const databaseRef = firebase
      .app()
      .database(
        'https://drawandguessgame-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(refPath);

    const valueListener = databaseRef.on('value', onValueChange);

    return () => {
      databaseRef.off('value', valueListener);
    };
  }, [state]);
  return (
    <Progress.Bar
      progress={
        state === 'playing'
          ? countDown / 120000
          : state === 'endRound'
          ? countDown / 10000
          : countDown / 15000
      }
      style={styles.progress}
      animationType="timing"
      height={16}
      borderRadius={20}
      borderColor="#fff"
      color="#fc8aff"
      unfilledColor="#6d45e7"
      width={null}
    />
  );
};

const styles = StyleSheet.create({
  progress: {
    height: 16,
    marginVertical: 8,
  },
});

export default CountDownProgressBar;
