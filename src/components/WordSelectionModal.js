import React, {useEffect, useState} from 'react';
import {firebase} from '@react-native-firebase/database';
import {Dimensions, Modal, StyleSheet, Text, View} from 'react-native';
import * as Progress from 'react-native-progress';
import {ThemedButton} from 'react-native-really-awesome-button';
import colors from '../assets/colors';
import commonStyles from '../assets/styles/commonStyles';

const windowWidth = Dimensions.get('window').width;

const WordSelectionModal = ({room, onSkip, onDraw, roomId}) => {
  const [keyWord, setKeyWord] = useState('');
  const [remainingTime, setRemainingTime] = useState(10000);

  useEffect(() => {
    room?.currentWord?.get().then(value => setKeyWord(value.data().value));

    const databaseRef = firebase
      .app()
      .database(
        'https://drawandguessgame-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref(`/rooms/${roomId}-choosing-${room?.roundCount - 1}`);

    const onValueChange = snapshot => {
      if (snapshot.val()) setRemainingTime(snapshot.val().remaining);
    };

    const valueListener = databaseRef.on('value', onValueChange);

    return () => {
      databaseRef.off('value', valueListener);
    };
  }, [room?.currentWord]);

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={styles.overlayView}>
        <View>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Đến lượt của bạn rồi đó!</Text>
            <Text style={styles.keyWord}>{keyWord ?? '404'}</Text>
            <View style={styles.btnContainer}>
              <ThemedButton
                name="bruce"
                type="anchor"
                backgroundColor={colors.blue}
                borderColor={colors.darkBlue}
                backgroundDarker={colors.darkBlue}
                textFontFamily="icielPony"
                raiseLevel={5}
                width={windowWidth * 0.3}
                style={styles.button}
                onPress={onSkip}>
                <Text style={[commonStyles.buttonText, {fontSize: 20}]}>
                  Bỏ lượt
                </Text>
              </ThemedButton>
              <ThemedButton
                name="bruce"
                type="anchor"
                backgroundColor={colors.green}
                borderColor={colors.darkGreen}
                backgroundDarker={colors.darkGreen}
                textFontFamily="icielPony"
                raiseLevel={5}
                width={windowWidth * 0.3}
                style={styles.button}
                onPress={onDraw}>
                <Text style={[commonStyles.buttonText, {fontSize: 20}]}>
                  Vẽ
                </Text>
              </ThemedButton>
            </View>
            <Progress.Bar
              progress={remainingTime / 10000}
              style={styles.progress}
              animationType="timing"
              height={10}
              borderRadius={20}
              borderColor={colors.darkBlue}
              color={colors.primary}
              unfilledColor={colors.darkBlue}
              width={windowWidth * 0.8}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    paddingTop: 35,
    paddingHorizontal: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 20,
    width: windowWidth * 0.9,
  },
  button: {
    // borderRadius: 20,
    // padding: 10,
    // elevation: 2,
    // marginHorizontal: 20,
  },

  modalText: {
    fontFamily: 'icielPony',
    fontSize: 20,
    color: 'black',
  },

  keyWord: {
    marginVertical: 15,
    fontFamily: 'icielPony',
    fontSize: 26,
    color: 'black',
  },

  text: {
    fontFamily: 'icielPony',
    fontSize: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  progress: {
    marginBottom: 10,
    marginTop: 20,
  },
});

export default WordSelectionModal;
