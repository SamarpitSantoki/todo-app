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
import AnimatedTaskLabel from "./animated-task-label";
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

  const hStackColor = themeTools.getColor(
    theme,
    useColorModeValue("warmgray.50", "primary.900")
  );
  return (
    <HStack alignItems="center" w="full" px={4} py={2} bg={hStackColor}>
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
      <AnimatedTaskLabel
        strikethrough={isDone}
        textColor={activeTextColor}
        inactiveTextColor={donetextColor}
        onPress={onToggleCheckbox}
      >
        Task item
      </AnimatedTaskLabel>
    </HStack>
  );
};

export default TaskItem;
