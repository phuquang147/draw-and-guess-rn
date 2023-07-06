import {useNavigation} from '@react-navigation/native';
import {ThemedButton} from 'react-native-really-awesome-button';
import Icon from 'react-native-vector-icons/Octicons';
import colors from '../assets/colors';

const BackButton = goBackKey => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack(goBackKey);
  };

  return (
    <ThemedButton
      name="bruce"
      type="anchor"
      backgroundColor={colors.blue}
      borderColor={colors.darkBlue}
      backgroundDarker={colors.darkBlue}
      textFontFamily="icielPony"
      borderRadius={8}
      paddingHorizontal={0}
      paddingTop={0}
      width={50}
      height={50}
      raiseLevel={2}
      onPress={handleBack}>
      <Icon name="chevron-left" size={24} color="white" />
    </ThemedButton>
  );
};

export default BackButton;
