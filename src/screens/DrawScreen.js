import {FastRoom} from '@netless/react-native-fastboard';
import {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

const DrawScreen = () => {
  // const [roomInfo, setRoomInfo] = useState(null);

  // useEffect(() => {
  //   const createRoom = async () => {
  //     let uid = null,
  //       uuid = null,
  //       roomToken = null;
  //     try {
  //       const {data, status} = await ChatRoomServices.createRoom();
  //       console.log(data);

  //       if (status === 201) {
  //         uid = '1asasda';
  //         uuid = data.uuid;
  //         const res = await ChatRoomServices.generateRoomToken(data.uuid);

  //         if (res.status === 201) {
  //           roomToken = res.data;
  //           setRoomInfo({
  //             uid,
  //             uuid,
  //             roomToken,
  //           });
  //         }
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   createRoom();
  // }, []);
  // console.log(roomInfo);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.drawAreaContainer}>
        {/* {roomInfo && (
          <FastRoom
            sdkParams={{
              appIdentifier: '7432e78cf23b40f6b1bffe7470b2d109',
              region: 'sg',
            }}
            roomParams={{
              uid: roomInfo.uid,
              uuid: roomInfo.uuid,
              roomToken: roomInfo.roomToken,
            }}
            style={styles.canvas}
          />
        )} */}
      </View>
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
  drawAreaContainer: {
    flex: 1,
    paddingBottom: 12,
    borderRadius: 20,
  },
  canvas: {
    width: 200,
    height: 500,
    backgroundColor: '#ccc',
  },
});
