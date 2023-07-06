import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

export const selectImageFromLibrary = handleUploadSuccess => {
  const options = {
    maxWidth: 2000,
    maxHeight: 2000,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  launchImageLibrary(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      const source = {uri: response.assets[0].uri};
      uploadImage(source.uri, handleUploadSuccess);
    }
  });
};

export const selectImageFromCamera = handleUploadSuccess => {
  const options = {
    maxWidth: 2000,
    maxHeight: 2000,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  launchCamera(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      const source = {uri: response.assets[0].uri};
      uploadImage(source.uri, handleUploadSuccess);
    }
  });
};

export const uploadImage = async (photo, handleUploadSuccess) => {
  const uri = photo;
  const filename = uri.substring(uri.lastIndexOf('/') + 1);
  const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  const task = storage().ref(filename).putFile(uploadUri);
  try {
    await task;
    const reference = storage().ref(filename);
    const imageUrl = await reference.getDownloadURL();
    handleUploadSuccess(imageUrl);
  } catch (e) {
    console.error(e);
  }
};
