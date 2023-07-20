import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import FIcon from 'react-native-vector-icons/Feather';
import OctIcon from 'react-native-vector-icons/Octicons';
import colors from '../assets/colors';
import commonStyles from '../assets/styles/commonStyles';
import BackButton from '../components/BackButton';
import DashedLine from '../components/DashedLine';
import PhotoSelectionModal from '../components/PhotoSelectionModal';
import ShadowWrapper from '../components/ShadowWrapper';
import {Picker} from '@react-native-picker/picker';

const NewTopicScreen = ({navigation, route}) => {
  const {user, userRole, topic} = route.params;
  const [words, setWords] = useState([]);
  const [word, setWord] = useState('');
  const [visibleModal, setVisiableModal] = useState(false);
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [privacy, setPrivacy] = useState('private');
  const [showAlert, setShowAlert] = useState(null);
  const [showConfirmAlert, setShowConfirmAlert] = useState('');

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setImage(topic.image);
      setWords(topic.words.map(word => ({id: uuid.v4(), value: word})));
      setPrivacy(topic.privacy);
    }
  }, [topic]);

  const handleBack = () => {
    navigation.goBack('ManageTopicsScreen');
  };

  const selectImage = () => {
    setVisiableModal(true);
  };

  const handleAddWord = () => {
    if (word.trim().length > 0) {
      setWords(prev => [...prev, {value: word, id: uuid.v4()}]);
      setWord('');
    }
  };

  const handleRemoveWord = id => {
    setWords(prev => prev.filter(word => word.id !== id));
  };

  const handleUploadSuccess = url => {
    setImage(url);
    setVisiableModal(false);
  };

  const handleCreateTopic = () => {
    if (image === '')
      setShowAlert({message: 'Vui lòng chọn ảnh', type: 'error'});
    else if (name.trim().length === 0)
      setShowAlert({message: 'Vui lòng nhập tên chủ đề', type: 'error'});
    else if (words.length === 0)
      setShowAlert({message: 'Vui lòng thêm từ vào chủ đề', type: 'error'});
    else {
      firestore()
        .collection('topics')
        .add({
          image,
          name,
          author: userRole === 'admin' ? 'admin' : user.uid,
          words: words.map(word => word.value),
          privacy: userRole === 'admin' ? 'public' : privacy,
          state: userRole === 'admin' ? 'accepted' : 'waiting',
        })
        .then(() => {
          setShowAlert({
            message: 'Thêm chủ đề thành công',
            type: 'success',
            callback: () => {
              handleBack();
            },
          });
        });
    }
  };

  const handleUpdateTopic = () => {
    if (image === '')
      setShowAlert({message: 'Vui lòng chọn ảnh', type: 'error'});
    else if (name.trim().length === 0)
      setShowAlert({message: 'Vui lòng nhập tên chủ đề', type: 'error'});
    else if (words.length === 0)
      setShowAlert({message: 'Vui lòng thêm từ vào chủ đề', type: 'error'});
    else {
      firestore()
        .collection('topics')
        .doc(topic.id)
        .update({
          image,
          name,
          author: user.uid,
          words: words.map(word => word.value),
          privacy,
          state: 'waiting',
        })
        .then(() => {
          setShowAlert({
            message: 'Chỉnh sửa chủ đề thành công',
            type: 'success',
          });
        });
    }
  };

  const handleDeleteTopic = () => {
    firestore()
      .collection('topics')
      .doc(topic.id)
      .delete()
      .then(() => {
        handleBack();
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require('../assets/images/bg.jpg')}>
        <View style={styles.header}>
          <BackButton />
        </View>
        <View style={styles.content}>
          <ShadowWrapper>
            <View style={styles.wordsContainer}>
              <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={selectImage}>
                  <Image
                    style={styles.avatar}
                    source={{
                      uri: image,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.nameContainer}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={value => setName(value)}
                  placeholder="Tên chủ đề"
                  placeholderTextColor="#bbb"
                />
              </View>
              {userRole !== 'admin' && (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={privacy}
                    onValueChange={(itemValue, itemIndex) =>
                      setPrivacy(itemValue)
                    }
                    style={styles.picker}
                    dropdownIconColor={colors.grey}>
                    <Picker.Item
                      style={styles.pickerItemText}
                      label="Riêng tư"
                      value={'private'}
                    />
                    <Picker.Item
                      style={styles.pickerItemText}
                      label="Công khai"
                      value={'public'}
                    />
                  </Picker>
                </View>
              )}
              <FlatList
                data={words}
                renderItem={({item}) => (
                  <View style={styles.wordContainer}>
                    <Text style={styles.word}>{item.value}</Text>
                    <Pressable
                      onPress={() => {
                        handleRemoveWord(item.id);
                      }}
                      android_ripple={{color: '#cc8686', radius: 20}}
                      style={styles.removeButton}>
                      <OctIcon name="x" size={24} color={colors.darkRed} />
                    </Pressable>
                  </View>
                )}
                keyExtractor={word => word.id}
                style={{flex: 1}}
                ItemSeparatorComponent={() => <DashedLine />}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={word}
                  onChangeText={value => setWord(value)}
                  placeholder="Nhập từ"
                  placeholderTextColor="#bbb"
                />
                <ThemedButton
                  name="bruce"
                  type="anchor"
                  backgroundColor={colors.yellow}
                  borderColor={colors.darkYellow}
                  backgroundDarker={colors.darkYellow}
                  textFontFamily="icielPony"
                  borderRadius={8}
                  width={50}
                  height={50}
                  paddingHorizontal={0}
                  raiseLevel={2}
                  onPress={handleAddWord}>
                  <OctIcon name="plus" size={24} color="white" />
                </ThemedButton>
              </View>
            </View>
          </ShadowWrapper>
          <View style={styles.buttonContainer}>
            {topic && (
              <ThemedButton
                name="bruce"
                type="anchor"
                backgroundColor={colors.red}
                borderColor={colors.darkRed}
                backgroundDarker={colors.darkRed}
                textFontFamily="icielPony"
                raiseLevel={5}
                style={styles.button}
                width={120}
                onPress={() => {
                  setShowConfirmAlert('Bạn có muốn xóa chủ đề này?');
                }}>
                <Text style={commonStyles.buttonText}>Xóa</Text>
              </ThemedButton>
            )}
            <ThemedButton
              name="bruce"
              type="anchor"
              backgroundColor={colors.green}
              borderColor={colors.darkGreen}
              backgroundDarker={colors.darkGreen}
              textFontFamily="icielPony"
              raiseLevel={5}
              style={[styles.button]}
              onPress={topic ? handleUpdateTopic : handleCreateTopic}>
              <Text style={commonStyles.buttonText}>
                {topic ? 'Cập nhật' : 'Xác nhận'}
              </Text>
            </ThemedButton>
          </View>
        </View>
      </ImageBackground>
      {visibleModal && <View style={styles.overlay}></View>}
      <PhotoSelectionModal
        visible={visibleModal}
        setVisiable={setVisiableModal}
        onUploadSuccess={handleUploadSuccess}
      />
      <AwesomeAlert
        show={!!showAlert}
        showProgress={false}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        onDismiss={() => {
          setShowAlert(null);
        }}
        contentContainerStyle={{borderRadius: 8}}
        showConfirmButton={true}
        onConfirmPressed={() => {
          setShowAlert(null);
          if (showAlert.callback) {
            showAlert.callback();
          }
        }}
        confirmText="OK"
        confirmButtonColor={colors.green}
        confirmButtonStyle={{
          paddingHorizontal: 24,
          paddingVertical: 8,
        }}
        confirmButtonTextStyle={{fontSize: 16}}
        customView={
          <View style={commonStyles.alertContainer}>
            <FIcon
              name={showAlert?.type === 'error' ? 'x-circle' : 'check-circle'}
              size={50}
              color={showAlert?.type === 'error' ? colors.red : colors.green}
            />
            <Text style={{color: '#555', fontSize: 16, textAlign: 'center'}}>
              {showAlert?.message}
            </Text>
          </View>
        }
      />
      <AwesomeAlert
        show={!!showConfirmAlert}
        showProgress={false}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        onDismiss={() => {
          setShowConfirmAlert('');
        }}
        contentContainerStyle={{borderRadius: 8}}
        showConfirmButton={true}
        onConfirmPressed={() => {
          handleDeleteTopic();
        }}
        confirmText="Xác nhận"
        confirmButtonColor={colors.green}
        confirmButtonStyle={{
          paddingHorizontal: 24,
          paddingVertical: 8,
        }}
        confirmButtonTextStyle={{fontSize: 16}}
        showCancelButton={true}
        onCancelPressed={() => {
          setShowConfirmAlert('');
        }}
        cancelText="Hủy"
        cancelButtonColor={colors.grey}
        cancelButtonStyle={{
          paddingHorizontal: 24,
          paddingVertical: 8,
        }}
        cancelButtonTextStyle={{fontSize: 16}}
        customView={
          <View style={commonStyles.alertContainer}>
            <FIcon name="warning-outline" size={50} color={colors.yellow} />
            <Text style={{color: '#555', fontSize: 16, textAlign: 'center'}}>
              {showConfirmAlert}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default NewTopicScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    padding: 16,
  },
  logo: {
    height: 80,
    width: 160,
    resizeMode: 'contain',
    backgroundColor: '#ced4da',
    opacity: 0.9,
    borderRadius: 19,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    marginBottom: 20,
  },
  wordsContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
  },
  inputContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    height: 50,
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    textAlign: 'left',
    borderRadius: 8,
    fontSize: 16,
    color: 'black',
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  word: {
    color: 'black',
    fontSize: 16,
  },
  avatar: {
    height: 80,
    width: 80,
    resizeMode: 'contain',
    backgroundColor: '#eee',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.darkGrey,
  },
  avatarContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  removeButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.lightRed,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.darkRed,
    borderWidth: 1,
  },
  nameContainer: {
    height: 50,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 16,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.25)',
    width: '100%',
    height: '100%',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    height: 50,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  picker: {
    color: 'black',
  },
  pickerItemText: {
    fontSize: 16,
    color: 'black',
  },
});
