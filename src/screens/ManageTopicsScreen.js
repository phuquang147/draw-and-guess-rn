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
import {ThemedButton} from 'react-native-really-awesome-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../assets/colors';
import commonStyles from '../assets/styles/commonStyles';
import BackButton from '../components/BackButton';
import DashedLine from '../components/DashedLine';
import Topic from '../components/ManageTopicsScreen/Topic';
import ShadowWrapper from '../components/ShadowWrapper';
import EmptyList from '../components/EmptyList';

const ManageTopicsScreen = ({navigation, route}) => {
  const [topics, setTopics] = useState([]);
  const {user} = route.params;

  useEffect(() => {
    const getTopics = async () => {
      await firestore()
        .collection('topics')
        .where('author', '==', user?.uid)
        .onSnapshot(snapshot => {
          setTopics(
            snapshot.docs.map(topic => ({...topic.data(), id: topic.id})),
          );
        });
    };

    getTopics();
  }, []);

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
            {topics.length > 0 ? (
              <FlatList
                data={topics}
                renderItem={({item}) => <Topic topic={item} />}
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
          </ShadowWrapper>
          <ThemedButton
            name="bruce"
            type="anchor"
            backgroundColor={colors.green}
            borderColor={colors.darkGreen}
            backgroundDarker={colors.darkGreen}
            textFontFamily="icielPony"
            textColor={colors.darkGreen}
            raiseLevel={5}
            width={null}
            style={styles.button}
            onPress={() => {
              navigation.navigate('NewTopicScreen');
            }}>
            <Text style={commonStyles.buttonText}>Thêm chủ đề</Text>
          </ThemedButton>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ManageTopicsScreen;

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
});
