import {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ThemedButton} from 'react-native-really-awesome-button';
import colors from '../../assets/colors';

const Hint = ({user, room}) => {
  const [word, setWord] = useState();

  useEffect(() => {
    const unsubscribeWord = room.currentWord.onSnapshot(snapshot => {
      setWord(snapshot.data());
    });

    return () => {
      unsubscribeWord();
    };
  }, [room.currentWord]);

  const handleHint = () => {
    if (room.canHint) {
      room.currentWord?.get().then(value => {
        const word = value.data();

        if (!word.showHint) {
          room.currentWord.update({
            showHint: true,
          });
        } else {
          const hintIndexes = [...word.hintIndexes];

          if (hintIndexes.length < 2) {
            let hintIndex = -1;
            while (hintIndex === -1) {
              const random = Math.floor(Math.random() * word.value.length);

              if (!hintIndexes.includes(random) && word.value[random] !== ' ')
                hintIndex = random;
            }
            hintIndexes.push(hintIndex);
            room.currentWord.update({
              hintIndexes,
            });
          }
        }
      });
    }
  };

  return user.isDrawing ? (
    <View style={{flexDirection: 'row'}}>
      <Text style={[styles.buttonText, {textAlign: 'center', py: 4}]}>
        {word?.value}
      </Text>
      <ThemedButton
        name="bruce"
        type="anchor"
        backgroundColor={colors.red}
        borderColor="black"
        backgroundDarker="black"
        textFontFamily="icielPony"
        borderRadius={100}
        width={150}
        raiseLevel={5}
        onPress={handleHint}>
        <Text style={styles.text}>Gợi ý</Text>
      </ThemedButton>
    </View>
  ) : (
    <View>
      {word?.showHint && (
        <View>
          {word.value.split('').map((letter, index) => (
            <Text key={`${letter}${Math.random()}`}>
              {word.hintIndexes.includes(index)
                ? letter !== ' '
                  ? letter
                  : ' '
                : '_'}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default Hint;

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: 'icielPony',
    fontSize: 30,
    color: '#333',
  },
  text: {
    fontFamily: 'icielPony',
    fontSize: 20,
  },
});
