import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import colors from '../assets/colors';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>
          Open up App.js to start working on your app!
        </Text>
        <Text style={styles.text}>
          Open up App.js to start working on your app!
        </Text>
        <Text style={styles.text}>
          Open up App.js to start working on your app!
        </Text>
        {/* <ThemedButton
          name="bruce"
          type="anchor"
          backgroundColor={colors.primary}
          borderColor="black"
          backgroundDarker="black"
          textFontFamily="Pony"
          raiseLevel={5}>
          <Text style={styles.text}>Bắt đầu</Text>
        </ThemedButton> */}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  text: {
    fontFamily: 'Pony',
    fontSize: 50,
    color: '#333',
  },
});
