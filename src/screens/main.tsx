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
        <Box w="auto" h="100px">
          <TaskItem isDone={checked} onToggleCheckbox={handlePressCheckbox} />
        </Box>
        <ThemeToggle />
      </VStack>
    </Center>
  );
}
