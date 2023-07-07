import React, {useState} from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import colors from '../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import commonStyles from '../assets/styles/commonStyles';
import {useNavigation} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const RoomInfoModal = ({room, onClose}) => {
  const navigation = useNavigation();
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    Clipboard.setString(room.id);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const onBack = () => {
    navigation.goBack('Home');
  };

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={styles.overlayView}>
        <View>
          <View style={styles.modalView}>
            <Text style={styles.title}>Thông tin phòng</Text>
            <View style={styles.roomInfo}>
              <View style={styles.idContainer}>
                <Text style={styles.modalText}>ID: {room.id}</Text>
                {isCopied ? (
                  <Icon
                    name="checkmark-circle-outline"
                    color={colors.green}
                    size={28}
                  />
                ) : (
                  <Pressable onPress={handleCopy}>
                    <Icon name="copy-outline" color={colors.blue} size={28} />
                  </Pressable>
                )}
              </View>

              <Text style={styles.modalText}>
                Người chơi tối đa: {room.maxMember}
              </Text>
              <Text style={styles.modalText}>
                Điểm kết thúc: {room.endPoint}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <ThemedButton
                name="bruce"
                type="anchor"
                backgroundColor={colors.red}
                borderColor={colors.darkRed}
                backgroundDarker={colors.darkRed}
                textFontFamily="icielPony"
                raiseLevel={5}
                width={null}
                style={styles.button}
                paddingHorizontal={16}
                onPress={() => {
                  onBack();
                }}>
                <Text style={[commonStyles.buttonText, {fontSize: 24}]}>
                  Thoát phòng
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
                width={null}
                paddingHorizontal={16}
                style={styles.button}
                onPress={() => {
                  onClose();
                }}>
                <Text style={[commonStyles.buttonText, {fontSize: 24}]}>
                  Đóng
                </Text>
              </ThemedButton>
            </View>
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
    borderRadius: 8,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: windowWidth * 0.95,
  },
  button: {
    marginVertical: 20,
  },
  idContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  modalText: {
    fontSize: 16,
    color: 'black',
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
  roomInfo: {
    gap: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default RoomInfoModal;
