import {View, StyleSheet} from 'react-native';

const ShadowWrapper = ({children}) => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>{children}</View>
    </View>
  );
};

export default ShadowWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#eee',
    paddingBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  subContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
