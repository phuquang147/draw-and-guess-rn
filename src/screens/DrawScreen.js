import { Feather } from "@expo/vector-icons";
import { FastRoom } from "@netless/react-native-fastboard";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ThemedButton } from "react-native-really-awesome-button";
import colors from "../colors";
import ChatRoomServices from "../services/chatRoomServices";
import Axios from "axios";
import { WhiteboardView } from "@netless/react-native-whiteboard";
import WebView from "react-native-webview";

const DrawScreen = () => {
  const [roomInfo, setRoomInfo] = useState(null);

  useEffect(() => {
    const createRoom = async () => {
      let uid = null,
        uuid = null,
        roomToken = null;
      try {
        const { data, status } = await ChatRoomServices.createRoom();
        console.log(data);

        if (status === 201) {
          uid = "1asasda";
          uuid = data.uuid;
          const res = await ChatRoomServices.generateRoomToken(data.uuid);

          if (res.status === 201) {
            roomToken = res.data;
            setRoomInfo({
              uid,
              uuid,
              roomToken,
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    createRoom();
  }, []);
  console.log(roomInfo);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.drawAreaContainer}>
        {roomInfo && (
          // <FastRoom
          //   sdkParams={{
          //     appIdentifier: "7432e78cf23b40f6b1bffe7470b2d109",
          //     region: "sg",
          //   }}
          //   roomParams={{
          //     uid: roomInfo.uid,
          //     uuid: roomInfo.uuid,
          //     roomToken: roomInfo.roomToken,
          //   }}
          //   style={styles.canvas}
          // />
          <WhiteboardView
            sdkConfig={{
              appIdentifier: "lt740PLeEe2rGsedTfSCvw/1fgYEXBhcn-BTw",
            }}
            roomConfig={{
              uid: Math.random().toString(),
              uuid: roomInfo.uuid,
              roomToken: roomInfo.roomToken,
            }}
            onStartShouldSetResponder={(e) => console.log(e)}
            joinRoomCallback={(a) => console.log(a)}
          />
        )}
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
    backgroundColor: colors.lightYellow,
    paddingBottom: 12,
    borderRadius: 20,
  },
  canvas: {
    width: 200,
    height: 500,
    backgroundColor: "#ccc",
  },
});
