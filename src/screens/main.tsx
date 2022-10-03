import { useState, useCallback, useEffect } from "react";
import {
  Text,
  Box,
  Center,
  VStack,
  useColorModeValue,
  Fab,
  Icon,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import ThemeToggle from "../components/theme-toggle";
import TaskItem from "../components/task-item";
import shortid from "shortid";
import TaskList from "../components/task-list";

const initialData = [
  {
    id: shortid.generate(),
    subject: "Make todo",
    done: false,
  },
  {
    id: shortid.generate(),
    subject: "Change UI",
    done: false,
  },
];

export default function MainScreen() {
  const [data, setData] = useState(initialData);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleToggleTaskItem = useCallback(
    (item: typeof initialData[0]) => {
      setData((prevData) => {
        return prevData.map((prevItem) => {
          if (prevItem.id === item.id) {
            return {
              ...prevItem,
              done: !prevItem.done,
            };
          }
          return prevItem;
        });
      });
    },
    [setData]
  );

  const handleChangeTaskItemSubject = useCallback(
    (item: typeof initialData[0], newSubject: string) => {
      setData((prevData) => {
        return prevData.map((prevItem) => {
          if (prevItem.id === item.id) {
            return {
              ...prevItem,
              subject: newSubject,
            };
          }
          return prevItem;
        });
      });
    },
    [setData]
  );

  const handleFinishEditingTaskItem = useCallback(
    (item: typeof initialData[0]) => {
      setEditingItemId(null);
    },
    [setEditingItemId]
  );

  const handlePressTaskItemLabel = useCallback(
    (item: typeof initialData[0]) => {
      setEditingItemId(item.id);
    },
    [setEditingItemId]
  );

  const handleRemoveItem = useCallback(
    (item: typeof initialData[0]) => {
      setData((prevData) => {
        return prevData.filter((prevItem) => prevItem.id !== item.id);
      });
    },
    [setData]
  );

  return (
    <Center
      _dark={{ bg: "blueGray.900" }}
      _light={{ bg: "blueGray.50" }}
      px={5}
      flex={1}
    >
      <VStack space={5} alignItems="center" w="full">
        <TaskList
          data={data}
          onToggleItem={handleToggleTaskItem}
          onChangeSubject={handleChangeTaskItemSubject}
          onFinishEditing={handleFinishEditingTaskItem}
          onPressLabel={handlePressTaskItemLabel}
          onRemoveItem={handleRemoveItem}
          editingItemId={editingItemId}
        />

        <ThemeToggle />
      </VStack>
      <Fab
        position="absolute"
        renderInPortal={false}
        size="sm"
        icon={<Icon color="white" as={<AntDesign name="plus" />} />}
        colorScheme={useColorModeValue("blue", "darkBlue")}
        bg={useColorModeValue("blue.500", "blue.500")}
        onPress={() => {
          const newId = shortid.generate();
          setData((prevData) => {
            return [
              {
                id: newId,
                subject: "",
                done: false,
              },
              ...prevData,
            ];
          });
          setEditingItemId(newId);
        }}
      />
    </Center>
  );
}
