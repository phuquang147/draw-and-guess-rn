import {FastRoom, WhiteboardView} from '@netless/react-native-fastboard';
import {SafeAreaView, StyleSheet, View} from 'react-native';

const DrawScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FastRoom
        sdkParams={{
          appIdentifier: 'lt740PLeEe2rGsedTfSCvw/1fgYEXBhcn-BTw',
          region: 'sg',
        }}
        roomParams={{
          uid: '12312333ggdfg',
          uuid: '76923320fd2a11edb9ef5d0c0890b290',
          roomToken:
            'NETLESSROOM_YWs9Zl9adUFmaVFwOENvRGY3dSZleHBpcmVBdD0xNjg1MjYzMDM0MDc4Jm5vbmNlPTE2ODUyNTk0MzQwNzgwMCZyb2xlPTAmc2lnPWZmYmFjZjE0NGNmNDIyZjkwYTM5NmYyOGIxNTY3MmJjZjFhMzg0OTEzMTllMjIxODkxNzgwZDJlZDg3MzNhNGEmdXVpZD03NjkyMzMyMGZkMmExMWVkYjllZjVkMGMwODkwYjI5MA',
        }}
        style={styles.canvas}
      />
    </SafeAreaView>
  );
};

export default DrawScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    paddingTop: 32,
  },
  canvas: {
    width: '100%',
    height: '100%',
    container: {
      width: '100%',
      height: '100%',
    },
  },
});
