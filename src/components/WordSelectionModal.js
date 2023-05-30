import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import * as Progress from 'react-native-progress';

import colors from '../assets/colors';

const windowWidth = Dimensions.get('window').width;

const WordSelectionModal = ({visible, keyWord}) => {
  // const [visible, setVisiable] = useState(true);

  const onSkip = () => {
    console.log('Skip');
  };
  const onDraw = () => {
    console.log('Draw');
  };
  const onClose = () => {
    setVisiable(false);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.overlayView} onPress={() => onClose()}>
        {/* <Pressable style={{backgroundColor: 'red'}} onPressOut={onClose()}> */}
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
              progress={0.7}
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
