import {useNavigation} from '@react-navigation/native';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../assets/colors';

const Topic = ({topic}) => {
  const navigation = useNavigation();

  return (
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
    borderWidth: 1,
    borderColor: colors.grey,
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
