import { useEffect } from "react";
import { Icon, Text, View } from "native-base";
import { AntDesign } from "@expo/vector-icons";

function GreetingTab() {
  // a function which returns is it evening, morning, afternoon, or night
  const getGreeting = () => {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 5 && hours < 12) {
      return (
        <Text fontSize={"4xl"} w={"full"} fontWeight="semibold">
          Good Morning
          <Icon
            padding={5}
            color="blue.300"
            size={"4xl"}
            as={<AntDesign name="cloud" />}
          />
        </Text>
      );
    } else if (hours >= 12 && hours < 17) {
      return (
        <Text fontSize={"4xl"} w={"full"} fontWeight="semibold">
          Good Afternoon
          <Icon
            padding={5}
            color="yellow.300"
            size={"4xl"}
            as={<AntDesign name="cloud" />}
          />
        </Text>
      );
    } else if (hours >= 17 && hours < 20) {
      return (
        <Text fontSize={"4xl"} w={"full"}>
          Good Evening
          <Icon
            padding={5}
            color="blue.500"
            size={"4xl"}
            as={<AntDesign name="rest" />}
          />
        </Text>
      );
    } else {
      return (
        <Text fontSize={"4xl"} w={"full"} fontWeight="semibold">
          Good Night
          <Icon
            padding={5}
            color="blue.300"
            size={"4xl"}
            as={<AntDesign name="star" />}
          />
        </Text>
      );
    }
  };
  return (
    <View
      alignItems={"flex-start"}
      width="full"
      padding={2}
      fontFamily="heading"
      marginY={3}
    >
      {getGreeting()}
      <Text fontSize={"4xl"} fontWeight="semibold">
        Samarpit
      </Text>
    </View>
  );
}
export default GreetingTab;
