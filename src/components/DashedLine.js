import {View} from 'react-native';

const DashedLine = () => {
  return (
    <View
      style={{
        width: '100%',
        borderStyle: 'dashed',
        borderBottomWidth: 1,
        borderColor: '#ccc',
      }}></View>
  );
};

export default DashedLine;
