import {View, Text, Image, StyleSheet} from 'react-native';
import Icon from "react-native-vector-icons/Entypo"
const CorrectAnswer = ({player}) => {
  return (
    <View style={styles.container}>
      <Icon name="check" size={18} color="#17a847" />
      <Text style={[styles.text, {fontWeight: "bold"}]}>
        {player.name}{' '}
        <Text style={styles.text}>chuẩn!</Text>
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
    color: '#17a847',
    fontFamily: 'Open Sans',
  },
});

export default CorrectAnswer;
