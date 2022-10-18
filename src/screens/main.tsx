import { useState, useCallback, useEffect } from "react";
import {
  Text,
  Center,
  VStack,
  useColorModeValue,
  Fab,
  Button,
  Icon,
  View,
  Input,
  Pressable,
  HStack,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";

import ThemeToggle from "../components/theme-toggle";
import shortid from "shortid";
import TaskList from "../components/task-list";
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import {
  addTask,
  deleteTask,
  filterTaskByStatus,
  selectTaskList,
  syncWithLocalStorage,
  toggleTaskState,
  updateTask,
} from "../redux/taskSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Speech from "expo-speech";
import { addEventListener } from "expo-linking";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ActivityIndicator } from "react-native";

export default function MainScreen() {
  const urlAI = useAppSelector((state) => state.backend.url);
  const taskList = useAppSelector(selectTaskList);
  const [filter, setFilter] = useState("all");
  const dispatch = useAppDispatch();
  const [data, setData] = useState(taskList);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [responseFromServer, setResponseFromServer] = useState<string | null>(
    null
  );
  const handleToggleTaskItem = useCallback(
    (item: typeof taskList[0]) => {
      dispatch(toggleTaskState(item.id));
    },
    [toggleTaskState]
  );

  const handleChangeTaskItemSubject = useCallback(
    (item: typeof taskList[0], subject: string) => {
      dispatch(updateTask({ id: item.id, subject, done: item.done }));
    },
    [updateTask]
  );

  const handleFinishEditingTaskItem = useCallback(
    (item: typeof taskList[0]) => {
      setEditingItemId(null);
    },
    [setEditingItemId]
  );

  const handlePressTaskItemLabel = useCallback(
    (item: typeof taskList[0]) => {
      setEditingItemId(item.id);
    },
    [setEditingItemId]
  );

  const handleRemoveItem = useCallback(
    (item: typeof taskList[0]) => {
      dispatch(deleteTask(item.id));
    },
    [setData]
  );

  const handleFilterTask = useCallback(
    (filter: string) => {
      setFilter(filter);
    },
    [setFilter]
  );

  const [results, setResults] = useState<any>([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    function onSpeechResults(e: SpeechResultsEvent) {
      console.log("onSpeechResults: ", e.value);

      setResults(e.value ?? []);
    }
    function onSpeechError(e: SpeechErrorEvent) {
      setIsListening(false);
      Speech.speak("Sorry, I didn't get that. Please try again.");
    }
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
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
        await Voice.start("en-IN");
        setIsListening(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    dispatch(syncWithLocalStorage());
  }, []);

  const talkToAi = () => {
    if (results[0] === "add") {
      const newId = shortid.generate();
      dispatch(addTask({ id: newId, subject: results[1], done: false }));
    }
  };

  useEffect(() => {
    if (results.length > 0) fetchResponse();
  }, [results]);

  useEffect(() => {
    dispatch(filterTaskByStatus(filter));
  }, [filter]);
  const fetchResponse = async () => {
    console.log("making request");
    try {
      const res = await axios.post(
        urlAI + "/webhooks/rest/webhook/",
        {
          recipint_id: "hit101",
          message: results[0],
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      console.log(res.data, "shi");
      setResponseFromServer(JSON.stringify(res.data));
      if (res.status === 200) {
        console.log(res.data);

        console.log(typeof res.data[0]);
        if (res.data[0]?.custom?.response_type === "add_task") {
          const newId = shortid.generate();
          dispatch(
            addTask({ id: newId, subject: "new Task - " + newId, done: false })
          );
        }

        if (res.data[0]?.custom?.response_type === "update_task") {
        }

        if (res.data[0]?.text) {
          Speech.speak(res.data[0].text);
        } else {
          Speech.speak(res.data[0]?.custom?.voiceovertext || "sorry");
        }
        setIsListening(false);
      } else {
        Speech.speak("Sorry, Could not understand");
        setIsListening(false);
        console.log("error", res.data);
      }
    } catch (e) {
      console.log(e);
      Speech.speak("Sorry, try again");
    }
  };

  // make a animated button with react reanimated

  return (
    <Center
      _dark={{ bg: "blueGray.900" }}
      _light={{ bg: "blueGray.50" }}
      px={5}
      flex={1}
    >
      <HStack
        space="1"
        alignItems="center"
        padding={"1"}
        bg={"gray.300"}
        borderRadius={10}
      >
        {/* animated button with react reanimated */}

        <Pressable
          rounded="xs"
          bg={filter === "all" ? "blueGray.100" : "gray.300"}
          shadow={filter === "all" ? 2 : 0}
          alignSelf="flex-start"
          py="1"
          px="2"
          borderRadius={10}
          width={"1/3"}
          onPress={() => {
            setFilter("all");
          }}
        >
          <Text
            textTransform="uppercase"
            fontSize="sm"
            fontWeight="bold"
            color="black"
            marginX={"auto"}
          >
            All
          </Text>
        </Pressable>
        <Pressable
          rounded="xs"
          shadow={filter === "active" ? 2 : 0}
          bg={filter === "active" ? "blueGray.100" : "gray.300"}
          alignSelf="flex-start"
          py="1"
          px="2"
          width={"1/3"}
          borderRadius={10}
          onPress={() => {
            setFilter("active");
          }}
        >
          <Text
            textTransform="uppercase"
            fontSize="sm"
            fontWeight="bold"
            color="black"
            marginX={"auto"}
          >
            Active
          </Text>
        </Pressable>
        <Pressable
          rounded="xs"
          shadow={filter === "completed" ? 2 : 0}
          bg={filter === "completed" ? "blueGray.100" : "gray.300"}
          alignSelf="flex-start"
          py="1"
          borderRadius={10}
          px="2"
          width={"1/3"}
          onPress={() => {
            setFilter("completed");
          }}
        >
          <Text
            textTransform="uppercase"
            fontSize="sm"
            fontWeight="bold"
            color="black"
            marginX={"auto"}
          >
            Completed
          </Text>
        </Pressable>
      </HStack>

      <VStack
        space={5}
        justifyContent={"flex-start"}
        alignItems="center"
        w="full"
        flexGrow={1}
      >
        <TaskList
          data={taskList as any}
          onToggleItem={handleToggleTaskItem}
          onChangeSubject={handleChangeTaskItemSubject}
          onFinishEditing={handleFinishEditingTaskItem}
          onPressLabel={handlePressTaskItemLabel}
          onRemoveItem={handleRemoveItem}
          editingItemId={editingItemId}
        />
      </VStack>

      <Fab
        position="absolute"
        placement="bottom-left"
        renderInPortal={false}
        size="sm"
        icon={
          isListening ? (
            <Icon
              color="white"
              as={<ActivityIndicator animating={isListening} color="white" />}
            />
          ) : (
            <Icon color="white" as={<AntDesign name="user" />} />
          )
        }
        colorScheme={useColorModeValue("blue", "darkBlue")}
        bg={useColorModeValue("blue.500", "blue.500")}
        onPress={toggleListening}
      />
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
    </Center>
  );
}
