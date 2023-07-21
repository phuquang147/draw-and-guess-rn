import {FastRoom} from '@netless/react-native-fastboard';
import {StyleSheet} from 'react-native';

const ViewDrawArea = ({user, room}) => {
  return (
    <FastRoom
      sdkParams={{
        appIdentifier: 'lt740PLeEe2rGsedTfSCvw/1fgYEXBhcn-BTw',
        region: 'sg',
      }}
      roomParams={{
        uid: user.uid,
        uuid: room.uuid,
        roomToken: room.roomToken,
        isWritable: false,
        disableCameraTransform: true,
      }}
      style={styles.guessCanvas}
      displayConfig={{
        showApplianceTools: false,
        showRedoUndo: false,
        showPageIndicator: false,
      }}
    />
  );
};

export default ViewDrawArea;

const styles = StyleSheet.create({
  guessCanvas: {
    flex: 1,
    container: {
      flex: 1,
    },
  },
});
