import { useState, useCallback } from "react";
import { Text, Box, Center, VStack, useColorModeValue } from "native-base";
import { Pressable } from "native-base";
import AnimatedCheckbox from "../components/animated-checkbox";
import ThemeToggle from "../components/theme-toggle";
import TaskItem from "../components/task-item";

export default function MainScreen() {
  const [checked, setChecked] = useState(false);
  const handlePressCheckbox = useCallback(() => {
    setChecked((prev) => !prev);
  }, []);

  return (
    <Center
      _dark={{ bg: "blueGray.900" }}
      _light={{ bg: "blueGray.50" }}
      px={5}
      flex={1}
    >
      <VStack space="5" alignItems="center">
        <Box p={10} bg={useColorModeValue("red.500", "yellow.500")}>
          <Text>Hello</Text>
        </Box>
        <Box w="100px" h="100px">
          <TaskItem isDone={checked} onToggleCheckbox={handlePressCheckbox} />
          {/* <Pressable onPress={handlePressCheckbox}>
            <AnimatedCheckbox
              boxOutlineColor="black"
              checkmarkColor="black"
              highlightColor="grey"
              checked={checked}
            />
          </Pressable> */}
        </Box>
        <ThemeToggle />
      </VStack>
    </Center>
  );
}
