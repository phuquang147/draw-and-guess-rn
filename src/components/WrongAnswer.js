import {StyleSheet, Text, View} from 'react-native';

const WrongAnswer = ({answer}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, {fontWeight: 'bold'}]}>
        {answer.name} <Text style={styles.text}>{answer.answer}</Text>
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
    color: '#959ba3',
    fontFamily: 'Open Sans',
  },
});

export default WrongAnswer;
