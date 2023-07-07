import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import FIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Octicons';
import colors from '../assets/colors';
import commonStyles from '../assets/styles/commonStyles';
import BackButton from '../components/BackButton';
import PhotoSelectionModal from '../components/PhotoSelectionModal';

const ProfileScreen = ({navigation, route}) => {
  const {userId} = route.params;
  const [user, setUser] = useState();
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState();
  const [visibleModal, setVisiableModal] = useState(false);
  const [showAlert, setShowAlert] = useState('');

  useEffect(() => {
    let subscribeUser = () => {};

    if (userId) {
      subscribeUser = firestore()
        .collection('users')
        .doc(userId)
        .onSnapshot(documentSnapshot => {
          setUser(documentSnapshot.data());
          setName(documentSnapshot.data().name);
        });
    }
    return () => {
      subscribeUser();
    };
  }, [userId]);

  const signOut = () => {
    GoogleSignin.revokeAccess();
    auth().signOut();
  };

  const onEditable = () => {
    setEditable(true);
  };

  const onNameChange = value => {
    setName(value);
  };

  const onCancel = () => {
    setName(user?.name);
    setEditable(false);
  };

  const onSave = () => {
    firestore()
      .collection('users')
      .doc(userId)
      .update({
        name: name,
      })
      .then(() => {
        setShowAlert('Cập nhật thành công');
        setEditable(false);
      });
  };

  const selectImage = () => {
    setVisiableModal(true);
  };

  const handleUploadSuccess = url => {
    firestore()
      .collection('users')
      .doc(userId)
      .update({
        photo: url,
      })
      .then(() => {
        setShowAlert('Cập nhật thành công');
        setVisiableModal(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require('../assets/images/bg.jpg')}>
        <View style={styles.header}>
          <BackButton goBackKey={'Home'} />
        </View>
        {user && (
          <View style={styles.content}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={selectImage}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri: user?.photo,
                  }}
                />
              </TouchableOpacity>
              <View style={styles.textInputContainter}>
                <TextInput
                  style={[
                    styles.input,
                    editable ? {color: 'black'} : {color: '#aaa'},
                  ]}
                  value={name}
                  editable={editable}
                  onChangeText={value => onNameChange(value)}
                />
                <View style={styles.buttonContainer}>
                  {!editable && (
                    <ThemedButton
                      name="bruce"
                      type="anchor"
                      backgroundColor={colors.yellow}
                      borderColor={colors.darkYellow}
                      backgroundDarker={colors.darkYellow}
                      textFontFamily="icielPony"
                      borderRadius={8}
                      paddingHorizontal={0}
                      paddingTop={0}
                      width={50}
                      height={50}
                      onPress={onEditable}
                      raiseLevel={2}>
                      <Icon name="pencil" size={24} color="black" />
                    </ThemedButton>
                  )}
                </View>
              </View>
              {editable && (
                <View style={styles.changeBtnContainer}>
                  <ThemedButton
                    name="bruce"
                    type="anchor"
                    backgroundColor={colors.red}
                    borderColor={colors.darkRed}
                    backgroundDarker={colors.darkRed}
                    textFontFamily="icielPony"
                    borderRadius={8}
                    paddingHorizontal={0}
                    paddingTop={0}
                    width={50}
                    height={50}
                    onPress={onCancel}
                    raiseLevel={2}>
                    <MCIcon name="close" size={28} color="white" />
                  </ThemedButton>
                  <ThemedButton
                    name="bruce"
                    type="anchor"
                    backgroundColor={colors.green}
                    borderColor={colors.darkGreen}
                    backgroundDarker={colors.darkGreen}
                    textFontFamily="icielPony"
                    borderRadius={8}
                    paddingHorizontal={0}
                    paddingTop={0}
                    width={50}
                    height={50}
                    onPress={onSave}
                    raiseLevel={2}>
                    <MCIcon name="check" size={28} color="white" />
                  </ThemedButton>
                </View>
              )}
            </View>

            <ThemedButton
              name="bruce"
              type="anchor"
              backgroundColor={colors.red}
              borderColor={colors.darkRed}
              backgroundDarker={colors.darkRed}
              textFontFamily="icielPony"
              raiseLevel={5}
              onPress={signOut}
              style={styles.button}>
              <Text style={commonStyles.buttonText}>Đăng xuất</Text>
            </ThemedButton>
          </View>
        )}
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
          setShowAlert(false);
        }}
        showConfirmButton={true}
        onConfirmPressed={() => {
          setShowAlert(null);
        }}
        confirmText="OK"
        confirmButtonColor={colors.green}
        confirmButtonStyle={{
          paddingHorizontal: 24,
          paddingVertical: 8,
        }}
        customView={
          <View style={styles.alertContainer}>
            <FIcon name="check-circle" size={50} color={colors.lightGreen} />
            <Text style={{color: '#555', fontSize: 16}}>{showAlert}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    // resizeMode: "contain",
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.25)',
    width: '100%',
    height: '100%',
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 40,
  },
  text: {
    fontFamily: 'icielPony',
    fontSize: 30,
    color: '#333',
  },
  button: {
    marginTop: 0,
  },
  avatarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  avatar: {
    height: 160,
    width: 160,
    resizeMode: 'contain',
    backgroundColor: '#ced4da',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.darkGrey,
  },
  input: {
    height: 50,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 8,
  },
  changeBtnContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  textInputContainter: {
    flexDirection: 'row',
    width: '60%',
  },
  buttonContainer: {
    position: 'absolute',
    right: -55,
  },
  alertContainer: {
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});
