import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const AlmostCorrectAnswer = ({answer}) => {
  return (
    <View style={styles.container}>
      <Icon name="flash" size={18} color="#ff9100" />
      <Text style={[styles.text, {fontWeight: 'bold'}]}>
        {answer.name} <Text style={styles.text}>gần đúng!</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#ff9100',
    fontFamily: 'Open Sans',
  },
});

export default AlmostCorrectAnswer;
