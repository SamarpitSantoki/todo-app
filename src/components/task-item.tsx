import { useCallback } from "react";
import { Pressable } from "native-base";
import {
  Box,
  useTheme,
  HStack,
  Text,
  themeTools,
  useColorModeValue,
} from "native-base";
import AnimatedCheckbox from "./animated-checkbox";

interface Props {
  isDone: boolean;
  onToggleCheckbox?: () => void;
}
const TaskItem = (props: Props) => {
  const { isDone, onToggleCheckbox } = props;
  const theme = useTheme();

  const highlightColor = themeTools.getColor(
    theme,
    useColorModeValue("blue.500", "blue.400")
  );
  const boxStroke = themeTools.getColor(
    theme,
    useColorModeValue("muted.300", "muted.500")
  );
  const checkmarkColor = themeTools.getColor(
    theme,
    useColorModeValue("white", "white")
  );
  const activeTextColor = themeTools.getColor(
    theme,
    useColorModeValue("darkText", "lightText")
  );
  const donetextColor = themeTools.getColor(
    theme,
    useColorModeValue("muted.400", "muted.600")
  );

  return (
    <HStack
      alignItems="center"
      w="full"
      px={4}
      py={2}
      bg={useColorModeValue("warmgray.50", "primary.900")}
    >
      <Box w={30} h={30} mr={2}>
        <Pressable onPress={onToggleCheckbox}>
          <AnimatedCheckbox
            checked={isDone}
            highlightColor={highlightColor}
            checkmarkColor={checkmarkColor}
            boxOutlineColor={boxStroke}
          />
        </Pressable>
      </Box>
      <Text onPress={onToggleCheckbox}>Hello</Text>
    </HStack>
  );
};

export default TaskItem;
