import { StyleSheet, Text, View } from "react-native";
import { ThemedButton } from "react-native-really-awesome-button";
import colors from "../colors";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Open up App.js to start working on your app!
      </Text>

      <ThemedButton
        name="bruce"
        type="anchor"
        backgroundColor={colors.primary}
        borderColor="black"
        backgroundDarker="black"
        textFontFamily="Pony"
        raiseLevel={5}
      >
        <Text style={styles.text}>Bắt đầu</Text>
      </ThemedButton>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageBg: {
    flex: 1,
  },
  text: {
    fontFamily: "Pony",
    fontSize: 30,
    color: "#333",
  },
});
