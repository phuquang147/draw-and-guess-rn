import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../assets/colors';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import WordSelectionModal from '../components/WordSelectionModal';
import PhotoSelectionModal from '../components/PhotoSelectionModal';

const ProfileScreen = ({navigation, route}) => {
  const {userId} = route.params;
  const [user, setUser] = useState();
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState();
  // const [photo, setPhoto] = useState();
  const [visibleModal, setVisiableModal] = useState(false);

  useEffect(() => {
    let subscribeUser = () => {};

    if (userId) {
      subscribeUser = firestore()
        .collection('users')
        .doc(userId)
        .onSnapshot(documentSnapshot => {
          setUser(documentSnapshot.data());
          setName(documentSnapshot.data().name);
          // setPhoto(documentSnapshot.data().photo);
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

  const onClose = () => {
    navigation.navigate('Home');
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
        Alert.alert('Thay đổi thành công!');
        setEditable(false);
      });
  };

  const selectImageFromLibrary = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      console.log(response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.assets[0].uri};
        console.log(source);
        uploadImage(source.uri);
      }
    });
  };

  const selectImageFromCamera = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log(response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.assets[0].uri};
        console.log(source);
        uploadImage(source.uri);
      }
    });
  };

  const selectImage = () => {
    setVisiableModal(true);
  };

  const uploadImage = async photo => {
    const uri = photo;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const task = storage().ref(filename).putFile(uploadUri);
    try {
      await task;
      const reference = storage().ref(filename);
      const imageUrl = await reference.getDownloadURL();
      firestore()
        .collection('users')
        .doc(userId)
        .update({
          photo: imageUrl,
        })
        .then(() => {
          Alert.alert('Thay đổi thành công!');
          setVisiableModal(false);
        });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={{
          uri: 'https://st3.depositphotos.com/6741230/13012/v/950/depositphotos_130128092-stock-illustration-doodles-seamless-pattern-vector-set.jpg',
        }}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require('../assets/images/splash.png')}
          />
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.red}
            borderColor="black"
            backgroundDarker="black"
            textFontFamily="icielPony"
            borderRadius={100}
            width={null}
            onPress={onClose}
            raiseLevel={5}>
            <Icon name="close" size={24} color="white" />
          </ThemedButton>
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

              <TextInput
                style={styles.input}
                value={name}
                editable={editable}
                onChangeText={value => onNameChange(value)}
              />
              {!editable ? (
                <ThemedButton
                  name="bruce"
                  type="anchor"
                  backgroundColor={colors.green}
                  borderColor="black"
                  backgroundDarker="black"
                  textFontFamily="icielPony"
                  raiseLevel={5}
                  width={null}
                  onPress={onEditable}
                  style={styles.button}>
                  <Text style={styles.text}>Thay đổi</Text>
                </ThemedButton>
              ) : (
                <View style={styles.changeBtnContainer}>
                  <ThemedButton
                    name="bruce"
                    type="anchor"
                    backgroundColor={colors.red}
                    borderColor="black"
                    backgroundDarker="black"
                    textFontFamily="icielPony"
                    raiseLevel={5}
                    width={null}
                    onPress={onCancel}
                    style={styles.button}>
                    <Text style={styles.text}>Hủy</Text>
                  </ThemedButton>
                  <ThemedButton
                    name="bruce"
                    type="anchor"
                    backgroundColor={colors.blue}
                    borderColor="black"
                    backgroundDarker="black"
                    textFontFamily="icielPony"
                    raiseLevel={5}
                    width={null}
                    onPress={onSave}
                    style={styles.button}>
                    <Text style={styles.text}>Lưu</Text>
                  </ThemedButton>
                </View>
              )}
            </View>

            <ThemedButton
              name="bruce"
              type="anchor"
              backgroundColor={colors.red}
              borderColor="black"
              backgroundDarker="black"
              textFontFamily="icielPony"
              raiseLevel={5}
              onPress={signOut}
              style={styles.button}>
              <Text style={styles.text}>Đăng xuất</Text>
            </ThemedButton>
          </View>
        )}
      </ImageBackground>
      {visibleModal && <View style={styles.overlay}></View>}
      <PhotoSelectionModal
        visible={visibleModal}
        setVisiable={setVisiableModal}
        onCamera={selectImageFromCamera}
        onPhotoLibrary={selectImageFromLibrary}
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
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    // flex: 1,
    // backgroundColor: "red",
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    borderWidth: 4,
    borderColor: 'black',
  },
  input: {
    height: 50,
    width: '60%',
    borderWidth: 4,
    borderColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 100,
    fontSize: 24,
  },
  changeBtnContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
});
