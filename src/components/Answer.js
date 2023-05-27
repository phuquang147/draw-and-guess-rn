import {View, Text, Image, StyleSheet} from 'react-native';
const Answer = ({chat}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, {fontWeight: 'bold'}]}>
        {chat.playerName} <Text style={styles.text}>{chat.answer}</Text>
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

export default Answer;
