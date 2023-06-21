import React, {useEffect, useState} from 'react';
import {Dimensions, Modal, StyleSheet, Text, View} from 'react-native';
import * as Progress from 'react-native-progress';
import {ThemedButton} from 'react-native-really-awesome-button';

import colors from '../assets/colors';

const windowWidth = Dimensions.get('window').width;

const WordSelectionModal = ({wordRef, onSkip, onDraw}) => {
  const [keyWord, setKeyWord] = useState('');
  const [remainingTime, setRemainingTime] = useState(10000);

  useEffect(() => {
    wordRef.get().then(value => setKeyWord(value.data().value));
  }, []);

  useEffect(() => {
    setInterval(() => {
      setRemainingTime(prev => prev - 1000);
    }, 1000);
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) onSkip();
  }, [remainingTime]);

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={styles.overlayView}>
        <View>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Đến lượt của bạn rồi đó!</Text>
            <Text style={styles.keyWord}>{keyWord ?? 'CON CHÓ'}</Text>
            <View style={styles.btnContainer}>
              <ThemedButton
                name="bruce"
                type="anchor"
                backgroundColor={colors.blue}
                borderColor="black"
                backgroundDarker="black"
                textFontFamily="icielPony"
                raiseLevel={5}
                width={windowWidth * 0.3}
                style={styles.button}
                onPress={onSkip}>
                <Text style={styles.text}>Bỏ lượt</Text>
              </ThemedButton>
              <ThemedButton
                name="bruce"
                type="anchor"
                backgroundColor={colors.green}
                borderColor="black"
                backgroundDarker="black"
                textFontFamily="icielPony"
                raiseLevel={5}
                width={windowWidth * 0.3}
                style={styles.button}
                onPress={onDraw}>
                <Text style={styles.text}>Vẽ</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  },

  keyWord: {
    marginVertical: 15,
    fontFamily: 'icielPony',
    fontSize: 30,
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
