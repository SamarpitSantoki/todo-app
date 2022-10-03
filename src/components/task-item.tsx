import { useCallback } from "react";
import { Input, Pressable } from "native-base";
import {
  Box,
  useTheme,
  HStack,
  themeTools,
  useColorModeValue,
  Icon,
} from "native-base";
import AnimatedCheckbox from "./animated-checkbox";
import AnimatedTaskLabel from "./animated-task-label";
import SwipableView from "./swipable-view";
import { Feather } from "@expo/vector-icons";
import { PanGestureHandlerProps } from "react-native-gesture-handler";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

interface Props extends Pick<PanGestureHandlerProps, "simultaneousHandlers"> {
  isEditing: boolean;
  isDone: boolean;
  onToggleCheckbox?: () => void;
  onPressLabel?: () => void;
  onRemove?: () => void;
  onChangeSubject?: (subject: string) => void;
  onFinishedEditing?: () => void;
  subject: string;
}

const TaskItem = (props: Props) => {
  const {
    isEditing,
    isDone,
    subject,
    simultaneousHandlers,
    onToggleCheckbox,
    onPressLabel,
    onRemove,
    onChangeSubject,
    onFinishedEditing,
  } = props;

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
    useColorModeValue("warmGray.50", "primary.900")
  );

  const handleChangeSubject = useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      onChangeSubject?.(e.nativeEvent.text);
    },
    [onChangeSubject]
  );

  return (
    <SwipableView
      simultaneousHandlers={simultaneousHandlers}
      onSwipeLeft={onRemove}
      backView={
        <Box
          w="full"
          h="full"
          bg="red.500"
          alignItems="flex-end"
          justifyContent="center"
          pr={4}
        >
          <Icon as={Feather} name="trash" size="sm" color="white" />
        </Box>
      }
    >
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
        {isEditing ? (
          <Input
            type="text"
            placeholder="Task"
            value={subject}
            variant="unstyled"
            fontSize={19}
            px={1}
            py={0}
            autoFocus
            blurOnSubmit
            onChange={handleChangeSubject}
            onBlur={onFinishedEditing}
          />
        ) : (
          <AnimatedTaskLabel
            strikethrough={isDone}
            textColor={activeTextColor}
            inactiveTextColor={donetextColor}
            onPress={onPressLabel}
          >
            {subject}
          </AnimatedTaskLabel>
        )}
      </HStack>
    </SwipableView>
  );
};

export default TaskItem;
