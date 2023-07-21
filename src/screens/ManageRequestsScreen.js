import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import {useEffect, useState} from 'react';
import {FlatList, ImageBackground, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../assets/colors';
import BackButton from '../components/BackButton';
import DashedLine from '../components/DashedLine';
import EmptyList from '../components/EmptyList';
import Request from '../components/ManageRequestsScreen/Request';
import ShadowWrapper from '../components/ShadowWrapper';

const ManageRequestsScreen = ({navigation, route}) => {
  const [requests, setRequests] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('waiting');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('topics')
      .onSnapshot(snapshot => {
        if (snapshot)
          setRequests(
            snapshot.docs
              .map(topic => ({...topic.data(), id: topic.id}))
              .filter(
                request =>
                  request.author !== 'admin' &&
                  request.privacy === 'public' &&
                  request.state === selectedFilter,
              ),
          );
      });

    return () => {
      unsubscribe();
    };
  }, [selectedFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require('../assets/images/bg.jpg')}>
        <View style={styles.header}>
          <BackButton goBackKey="HomeScreen" />
        </View>
        <View style={styles.content}>
          <ShadowWrapper>
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedFilter}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedFilter(itemValue)
                  }
                  style={styles.picker}
                  dropdownIconColor={colors.grey}>
                  <Picker.Item
                    style={styles.pickerItemText}
                    label="Chờ duyệt"
                    value="waiting"
                  />
                  <Picker.Item
                    style={styles.pickerItemText}
                    label="Đã duyệt"
                    value="accepted"
                  />
                </Picker>
              </View>
              {requests.length > 0 ? (
                <FlatList
                  data={requests}
                  renderItem={({item}) => <Request topic={item} />}
                  keyExtractor={item => item.id}
                  style={styles.topics}
                  ItemSeparatorComponent={() => <DashedLine />}
                />
              ) : (
                <EmptyList
                  image={require('../assets/images/empty.png')}
                  title={'Hổng có gì cả :)'}
                />
              )}
            </View>
          </ShadowWrapper>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ManageRequestsScreen;

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
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  topics: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    color: 'black',
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    borderRadius: 8,
    fontSize: 20,
  },
  pickerContainer: {
    color: 'black',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    height: 50,
    marginTop: 20,
    marginVertical: 6,
    marginHorizontal: 20,
  },
});
