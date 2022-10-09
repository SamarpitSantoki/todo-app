import { useState, useCallback, useEffect } from "react";
import {
  Text,
  Center,
  VStack,
  useColorModeValue,
  Fab,
  Icon,
  View,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import ThemeToggle from "../components/theme-toggle";
import shortid from "shortid";
import TaskList from "../components/task-list";
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";
import { Button } from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import {
  addTask,
  selectTaskList,
  syncWithLocalStorage,
  toggleTaskState,
  updateTask,
} from "../redux/taskSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const taskList = useAppSelector(selectTaskList);
  const dispatch = useAppDispatch();
  const [data, setData] = useState(initialData);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleToggleTaskItem = useCallback(
    (item: typeof initialData[0]) => {
      dispatch(toggleTaskState(item.id));
    },
    [toggleTaskState]
  );

  const handleChangeTaskItemSubject = useCallback(
    (item: typeof initialData[0], subject: string) => {
      dispatch(updateTask({ id: item.id, subject, done: item.done }));
    },
    [updateTask]
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

  const [results, setResults] = useState<any>([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    function onSpeechResults(e: SpeechResultsEvent) {
      setResults(e.value ?? []);
    }
    function onSpeechError(e: SpeechErrorEvent) {
      console.error(e);
    }
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    return function cleanup() {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  async function toggleListening() {
    try {
      if (isListening) {
        if (await Voice.isRecognizing()) await Voice.stop();
        setIsListening(false);
      } else {
        setResults([]);
        await Voice.start("en-US");
        setIsListening(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // useEffect(() => {
  //   if (results.length > 0) {
  //     dispatch(addTask(results[0]));
  //     toggleListening();
  //   }
  // }, [results]);

  const saveToLocalStorage = useCallback(async () => {
    await AsyncStorage.setItem("taskList", JSON.stringify(taskList));
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [taskList]);

  useEffect(() => {
    dispatch(syncWithLocalStorage());
  }, []);
  return (
    <Center
      _dark={{ bg: "blueGray.900" }}
      _light={{ bg: "blueGray.50" }}
      px={5}
      flex={1}
    >
      <VStack space={5} alignItems="center" w="full">
        <TaskList
          data={taskList as any}
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
          dispatch(
            addTask({
              id: newId,
              subject: "",
              done: false,
            })
          );
          setEditingItemId(newId);
        }}
      />
      <View>
        <Text>Press the button start speaking.</Text>
        <Button
          title={isListening ? "Stop Recognizing" : "Start Recognizing"}
          onPress={toggleListening}
        />
        <Text>Results:</Text>
        {results.map((result: any, index: any) => {
          return <Text key={`result-${index}`}>{result}</Text>;
        })}
      </View>
    </Center>
  );
}
