import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const Received = ({ image, message }: any) => {
  return (
    <View style={styles.container}>
      {/* another linearGradient for sent text */}

      <LinearGradient colors={["#198f51", "#078348"]} style={styles.gradient}>
        <Text style={styles.message}>{message}</Text>
      </LinearGradient>
      <Text style={styles.duration}>12:34 AM</Text>
    </View>
  );
};
export default Received;
const styles = StyleSheet.create({
  duration: {
    color: "#b6b6b6",
    fontSize: 11,
    marginHorizontal: 15,
    marginTop: 5,
    fontFamily: "Montserrat_600SemiBold",
  },
  gradient: {
    maxWidth: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  container: {
    flexDirection: "row",
    marginBottom: 20,
    width: 250,
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  message: {
    fontSize: 13,
    marginHorizontal: 15,
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
  },
});
