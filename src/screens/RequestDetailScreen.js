import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import FIcon from 'react-native-vector-icons/Feather';
import colors from '../assets/colors';
import commonStyles from '../assets/styles/commonStyles';
import BackButton from '../components/BackButton';
import DashedLine from '../components/DashedLine';
import ShadowWrapper from '../components/ShadowWrapper';

const RequestDetailScreen = ({navigation, route}) => {
  const {topic} = route.params;
  const [words, setWords] = useState([]);
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [showAlert, setShowAlert] = useState(null);
  const [showConfirmAlert, setShowConfirmAlert] = useState(undefined);
  const [state, setState] = useState('');

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setImage(topic.image);
      setState(topic.state);
      setWords(topic.words.map(word => ({id: uuid.v4(), value: word})));
    }
  }, [topic]);

  const handleAccept = () => {
    firestore()
      .collection('topics')
      .doc(topic.id)
      .update({
        state: 'accepted',
      })
      .then(() => {
        setShowAlert({
          message: 'Đã chấp nhận chủ đề thành công',
          type: 'success',
        });
        setShowConfirmAlert(undefined);
        navigation.goBack();
      });
  };

  const handleReject = () => {
    firestore()
      .collection('topics')
      .doc(topic.id)
      .update({
        state: 'rejected',
      })
      .then(() => {
        setShowAlert({
          message: 'Từ chối chủ đề thành công',
          type: 'success',
        });
        setShowConfirmAlert(undefined);
        navigation.goBack();
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
                <Image
                  style={styles.avatar}
                  source={{
                    uri: image,
                  }}
                />
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.topicName}>{name}</Text>
              </View>
              <FlatList
                data={words}
                renderItem={({item}) => (
                  <View style={styles.wordContainer}>
                    <Text style={styles.word}>{item.value}</Text>
                  </View>
                )}
                keyExtractor={word => word.id}
                style={{flex: 1}}
                ItemSeparatorComponent={() => <DashedLine />}
              />
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
                width={146}
                onPress={() => {
                  setShowConfirmAlert({
                    message: 'Từ chối chủ đề này?',
                    type: 'reject',
                  });
                }}>
                <Text style={commonStyles.buttonText}>Từ chối</Text>
              </ThemedButton>
            )}
            {state !== 'accepted' && (
              <ThemedButton
                name="bruce"
                type="anchor"
                backgroundColor={colors.green}
                borderColor={colors.darkGreen}
                backgroundDarker={colors.darkGreen}
                textFontFamily="icielPony"
                raiseLevel={5}
                style={[styles.button]}
                onPress={() => {
                  setShowConfirmAlert({
                    message: 'Xác nhận chủ đề này?',
                    type: 'accept',
                  });
                }}>
                <Text style={commonStyles.buttonText}>Xác nhận</Text>
              </ThemedButton>
            )}
          </View>
        </View>
      </ImageBackground>
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
        show={showConfirmAlert}
        showProgress={false}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        onDismiss={() => {
          setShowConfirmAlert(undefined);
        }}
        contentContainerStyle={{borderRadius: 8}}
        showConfirmButton={true}
        onConfirmPressed={() => {
          showConfirmAlert.type === 'accept' ? handleAccept() : handleReject();
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
          setShowConfirmAlert(undefined);
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
              {showConfirmAlert?.message}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default RequestDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    padding: 16,
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
  nameContainer: {
    height: 50,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 16,
  },
  topicName: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
