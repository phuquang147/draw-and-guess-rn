import {View, Image, Text, StyleSheet} from 'react-native';

const EmptyList = ({image, title}) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default EmptyList;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    color: '#999',
    fontSize: 16,
    fontFamily: 'icielPony',
  },
});
