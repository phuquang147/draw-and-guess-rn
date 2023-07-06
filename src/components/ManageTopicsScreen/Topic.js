import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../assets/colors';
import {useNavigation} from '@react-navigation/native';

const Topic = ({topic}) => {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => {}}>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Image
            style={styles.image}
            source={{
              uri: topic.image,
            }}
          />
          <Text style={styles.name}>{topic.name}</Text>
        </View>
        <Pressable
          style={styles.editButton}
          android_ripple={{color: '#84accc', radius: 20}}
          onPress={() => {
            navigation.navigate('NewTopicScreen', {topic});
          }}>
          <Icon name="circle-edit-outline" size={24} color={colors.darkBlue} />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default Topic;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  name: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.lightBlue,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.darkBlue,
    borderWidth: 1,
  },
});
