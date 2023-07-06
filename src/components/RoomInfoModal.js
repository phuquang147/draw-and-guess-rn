import React, {useState} from 'react';
import {Dimensions, Modal, StyleSheet, Text, View, Pressable} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import colors from '../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';

const windowWidth = Dimensions.get('window').width;

const RoomInfoModal = ({room, onClose}) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    Clipboard.setString(room.id);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false)
    }, 3000)
  };

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={styles.overlayView}>
        <View>
          <View style={styles.modalView}>
            <Text style={styles.title}>Thông tin phòng</Text>
            <View style={styles.idContainer}>
              <Text style={styles.modalText}>ID: {room.id}</Text>
              {isCopied ? (
                <Icon name="checkmark-circle-outline" color={colors.green} size={28} />
              ) : (
                <Pressable onPress={handleCopy}>
                  <Icon name="copy-outline" color={colors.blue} size={28} />
                </Pressable>
              )}
            </View>

            <Text style={styles.modalText}>
              Người chơi tối đa: {room.maxMember}
            </Text>
            <Text style={styles.modalText}>Điểm kết thúc: {room.endPoint}</Text>

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
              onPress={() => {
                onClose();
              }}>
              <Text style={styles.text}>Ok</Text>
            </ThemedButton>
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
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 0,
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
    width: windowWidth * 0.95,
  },
  button: {
    marginVertical: 15,
  },
  idContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  modalText: {
    fontFamily: 'icielPony',
    fontSize: 20,
  },

  title: {
    marginVertical: 15,
    fontFamily: 'icielPony',
    fontSize: 28,
    color: 'black',
  },

  text: {
    fontFamily: 'icielPony',
    fontSize: 20,
  },
  progress: {
    marginBottom: 10,
    marginTop: 20,
  },
});

export default RoomInfoModal;
