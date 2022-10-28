import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/AntDesign";

import Received from "./Received";
import Sent from "./Sent";
import Input from "./Input";
import { useAppSelector } from "../../hooks/storeHooks";

const Discussion = ({ navigation }: any) => {
  const { itemName, itemPic } = {
    itemName: "samarpit",
    itemPic:
      "https://images.unsplash.com/photo-1593642532972-7d3c3d4d8d7c?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtYXJwaXQlMjB3b3Jrc3BhY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
  };
  const [inputMessage, setMessage] = useState("");
  const Data = useAppSelector((state) => state.story.messages);

  const onSendPress = () => {
    console.log("send pressed");
  };

  const send = () => {
    setMessage("");
  };

  // lets make a function to render the messages
  const renderMessages = () => {
    return Data.map((message: any, index: number) => {
      if (message.sender === "ai") {
        return <Received key={index} message={message.message} />;
      } else {
        return <Sent key={index} message={message.message} />;
      }
    });
  };

  return (
    <>
      <View style={styles.main}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <Sent image={itemPic} message={"hello there"} /> */}
          {renderMessages()}
        </ScrollView>
      </View>
      <Input
        inputMessage={inputMessage}
        setMessage={(inputMessage: any) => setMessage(inputMessage)}
        onSendPress={send}
      />
    </>
  );
};
export default Discussion;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    zIndex: 100,
  },
  main: {
    backgroundColor: "#FFF",
    height: "80%",
    paddingHorizontal: 20,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 10,
    // marginTop: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "#000119",
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
    flex: 1,
    textAlign: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
