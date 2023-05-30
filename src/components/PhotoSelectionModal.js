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

const PhotoSelectionModal = ({
  visible,
  setVisiable,
  onPhotoLibrary,
  onCamera,
}) => {
  const onClose = () => {
    setVisiable(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <Pressable
        animationType="fade"
        style={styles.overlayView}
        onPress={() => onClose()}>
        {/* <Pressable style={{backgroundColor: 'red'}} onPressOut={onCamera()}> */}
        <TouchableWithoutFeedback style={{backgroundColor: 'red'}}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Chọn ảnh từ </Text>
            <ThemedButton
              name="bruce"
              type="anchor"
              backgroundColor={colors.blue}
              borderColor="black"
              backgroundDarker="black"
              textFontFamily="icielPony"
              raiseLevel={5}
              style={styles.button}
              onPress={onCamera}>
              <Text style={styles.text}>Camera</Text>
            </ThemedButton>
            <ThemedButton
              name="bruce"
              type="anchor"
              backgroundColor={colors.green}
              borderColor="black"
              backgroundDarker="black"
              textFontFamily="icielPony"
              raiseLevel={5}
              style={styles.button}
              onPress={onPhotoLibrary}>
              <Text style={styles.text}>Thư viện ảnh</Text>
            </ThemedButton>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,

    borderWidth: 2,
    paddingVertical: 20,
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
    width: windowWidth,
    gap: 20,
  },
  button: {
    // borderRadius: 20,
    // padding: 10,
    // elevation: 2,
    // marginHorizontal: 20,
  },

  modalText: {
    fontFamily: 'icielPony',
    fontSize: 26,
    color: 'black',
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

export default PhotoSelectionModal;
