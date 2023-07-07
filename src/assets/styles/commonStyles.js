const {StyleSheet} = require('react-native');

const commonStyles = StyleSheet.create({
  buttonText: {
    fontFamily: 'icielPony',
    fontSize: 30,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 10,
  },
  input: {
    height: 50,
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    textAlign: 'left',
    borderRadius: 8,
    fontSize: 16,
    color: 'black',
  },
  alertContainer: {
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});

export default commonStyles;
