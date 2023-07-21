import {FastRoom} from '@netless/react-native-fastboard';
import {StyleSheet} from 'react-native';

const DrawArea = ({user, room}) => {
  const drawingBoard = value => {
    value.room.cleanScene(true);
  };

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
        rejectWhenReadonlyErrorLevel: true,
      }}
      style={styles.canvas}
      joinRoomSuccessCallback={FastRoomObject => drawingBoard(FastRoomObject)}
    />
  );
};

export default DrawArea;

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    container: {
      flex: 1,
    },
  },
});
