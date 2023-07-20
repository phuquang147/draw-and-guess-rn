import {useNavigation} from '@react-navigation/native';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../assets/colors';

const Topic = ({topic}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <Image
            style={styles.image}
            source={{
              uri: topic.image,
            }}
          />
          <Text style={styles.name} numberOfLines={1}>
            {topic.name}
          </Text>
        </View>
        {topic.privacy === 'public' ? (
          <Text
            style={[
              styles.text,
              topic.state === 'waiting'
                ? {color: '#e67700', backgroundColor: '#ffec99'}
                : topic.state === 'accepted'
                ? {color: '#2b8a3e', backgroundColor: '#c0eb75'}
                : {color: '#212529', backgroundColor: '#e9ecef'},
            ]}>
            {topic.state === 'waiting'
              ? 'Chờ duyệt'
              : topic.state === 'accepted'
              ? 'Công khai'
              : 'Từ chối'}
          </Text>
        ) : (
          <Text
            style={[
              styles.text,
              {color: '#c92a2a', backgroundColor: '#ffc9c9'},
            ]}>
            Riêng tư
          </Text>
        )}
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
    gap: 8,
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flex: 1,
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
    flex: 1,
  },
  text: {
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    width: 80,
    textAlign: 'center',
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
