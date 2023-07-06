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
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import OctIcon from 'react-native-vector-icons/Octicons';
import colors from '../assets/colors';
import commonStyles from '../assets/styles/commonStyles';
import BackButton from '../components/BackButton';
import DashedLine from '../components/DashedLine';
import PhotoSelectionModal from '../components/PhotoSelectionModal';
import ShadowWrapper from '../components/ShadowWrapper';

const NewTopicScreen = ({navigation, route}) => {
  const {user, topic} = route.params;
  const [words, setWords] = useState([]);
  const [word, setWord] = useState('');
  const [visibleModal, setVisiableModal] = useState(false);
  const [image, setImage] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setImage(topic.image);
      setWords(topic.words.map(word => ({id: uuid.v4(), value: word})));
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
  };

  const handleCreateTopic = () => {
    if (image === '') Alert.alert('Vui lòng chọn ảnh');
    else if (name.trim().length === 0) Alert.alert('Vui lòng nhập tên');
    else if (words.length === 0) Alert.alert('Vui lòng thêm từ');
    else {
      firestore()
        .collection('topics')
        .add({
          image,
          name,
          author: user.uid,
          words: words.map(word => word.value),
        })
        .then(() => {
          handleBack();
        });
    }
  };

  const handleUpdateTopic = () => {
    if (image === '') Alert.alert('Vui lòng chọn ảnh');
    else if (name.trim().length === 0) Alert.alert('Vui lòng nhập tên');
    else if (words.length === 0) Alert.alert('Vui lòng thêm từ');
    else {
      firestore()
        .collection('topics')
        .doc(topic.id)
        .update({
          image,
          name,
          author: user.uid,
          words: words.map(word => word.value),
        })
        .then(() => {
          handleBack();
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
              <FlatList
                data={words}
                renderItem={({item}) => (
                  <View style={styles.wordContainer}>
                    <Text style={styles.word}>{item.value}</Text>
                    <Pressable
                      onPress={() => {
                        handleRemoveWord(item.id);
                      }}
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
                onPress={handleDeleteTopic}>
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
    borderColor: colors.lightBlue,
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
});