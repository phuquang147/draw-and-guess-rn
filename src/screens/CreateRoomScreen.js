import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';

import colors from '../assets/colors';
import {useState} from 'react';

const CreateRoomScreen = ({navigation}) => {
  const [selectedNumber, setSelectedNumber] = useState(10);
  const [selectedPoint, setSelectedPoint] = useState(120);

  const goBack = () => {
    navigation.navigate('Home');
  };

  const onClose = () => {
    navigation.navigate('Home');
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
            raiseLevel={5}
            onPress={onClose}>
            <Icon name="close" size={24} color="white" />
          </ThemedButton>
        </View>
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <ThemedButton
              name="bruce"
              type="anchor"
              borderColor="black"
              backgroundDarker="black"
              textFontFamily="icielPony"
              borderRadius={100}
              width={null}
              raiseLevel={5}>
              <Icon name="arrow-left" size={24} color="black" />
            </ThemedButton>
            <Image
              style={styles.avatar}
              source={require('../assets/images/splash.png')}
            />
            <ThemedButton
              name="bruce"
              type="anchor"
              borderColor="black"
              backgroundDarker="black"
              textFontFamily="icielPony"
              borderRadius={100}
              width={null}
              raiseLevel={5}>
              <Icon name="arrow-right" size={24} color="black" />
            </ThemedButton>
          </View>
          <View style={styles.pickersContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedNumber}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedNumber(itemValue)
                }
                style={styles.picker}>
                <Picker.Item style={{fontSize: 24}} label="5 Người" value={5} />
                <Picker.Item
                  style={{fontSize: 24}}
                  label="10 Người"
                  value={10}
                />
                <Picker.Item
                  style={{fontSize: 24}}
                  label="15 Người"
                  value={15}
                />
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedPoint}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedPoint(itemValue)
                }
                style={styles.picker}>
                <Picker.Item
                  style={{fontSize: 24}}
                  label="100 Điểm"
                  value={100}
                />
                <Picker.Item
                  style={{fontSize: 24}}
                  label="120 Điểm"
                  value={120}
                />
                <Picker.Item
                  style={{fontSize: 24}}
                  label="150 Điểm"
                  value={150}
                />
                <Picker.Item
                  style={{fontSize: 24}}
                  label="180 Điểm"
                  value={180}
                />
              </Picker>
            </View>
          </View>

          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.green}
            borderColor="black"
            backgroundDarker="black"
            textFontFamily="icielPony"
            raiseLevel={5}
            style={styles.button}>
            <Text style={styles.text}>Tạo phòng</Text>
          </ThemedButton>
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.pink}
            borderColor="black"
            backgroundDarker="black"
            textFontFamily="icielPony"
            raiseLevel={5}
            style={styles.button}
            onPress={goBack}>
            <Text style={styles.text}>Trở về</Text>
          </ThemedButton>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default CreateRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    // resizeMode: "contain",
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'icielPony',
    fontSize: 30,
    color: '#333',
  },
  button: {
    marginBottom: 20,
  },
  avatarContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
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
  picker: {
    flex: 1,
    // marginVertical: 30,
    // marginHorizontal: 20,
    borderWidth: 4,
    borderColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 100,
    fontSize: 24,
  },
  pickerContainer: {
    borderWidth: 4,
    borderRadius: 100,
    overflow: 'hidden',
    width: '60%',
    justifyContent: 'center',
    height: 50,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  pickersContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
});
