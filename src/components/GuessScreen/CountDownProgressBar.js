import {firebase} from '@react-native-firebase/database';
import {useEffect, useState} from 'react';
import * as Progress from 'react-native-progress';
import {StyleSheet} from 'react-native';

const CountDownProgressBar = ({roomId, roundCount}) => {
  const [countDown, setCountDown] = useState(120000);

  useEffect(() => {
    const onValueChange = firebase
      .app()
      .database(
        'https://drawandguessgame-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(`/rooms/${roomId}-${roundCount}`)
      .on('value', snapshot => {
        console.log(snapshot.val());
        if (snapshot.val()) setCountDown(snapshot.val().remaining);
      });

    return () => {
      firebase
        .app()
        .database(
          'https://drawandguessgame-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref(`/rooms/${roomId}`)
        .off('value', onValueChange);
    };
  }, []);
  //   console.log(countDown);
  return (
    <Progress.Bar
      progress={countDown / 120000}
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
