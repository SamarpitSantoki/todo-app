import React from "react";
import { View, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";

const Input = ({ inputMessage, onSendPress, setMessage }: any) => {
  return (
    <View style={styles.container}>
      <Entypo name="emoji-happy" color="#fff" size={20} />
      <TextInput
        // style={styles.input}
        placeholder="Some text"
        value={inputMessage}
        onChangeText={setMessage}
        style={styles.input}
      />
      <TouchableOpacity onPress={onSendPress}>
        <Ionicons name="ios-send" color="#fff" size={20} />
      </TouchableOpacity>
    </View>
  );
};
export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    width: "75%",
    position: "absolute",
    right: 30,
    bottom: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  input: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 11,
    color: "000",
    paddingHorizontal: 10,
    flex: 1,
  },
});
