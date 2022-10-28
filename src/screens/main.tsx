import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  Text,
  Center,
  VStack,
  useColorModeValue,
  Fab,
  View,
  Icon,
  Pressable,
  HStack,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import BottomSheet, { useBottomSheet } from "@gorhom/bottom-sheet";
import shortid from "shortid";
import TaskList from "../components/taskList/task-list";
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
  updateTaskList,
} from "../redux/taskSlice";
import axios from "axios";
import * as Speech from "expo-speech";
import ChatScreen from "../components/chat";
import { ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { addMessage, resetStory } from "../redux/storySlice";
import e from "cors";
import GreetingTab from "../components/greeting-tab";

export default function MainScreen() {
  const urlAI = useAppSelector((state) => state.backend.url);
  const taskList = useAppSelector(selectTaskList);
  const storyId = useAppSelector((state) => state.story.storyId);
  const [filter, setFilter] = useState("all");
  const dispatch = useAppDispatch();
  const [data, setData] = useState(taskList);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
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

  const [results, setResults] = useState<any>([]);
  const [isListening, setIsListening] = useState(false);

  // check if keyboard open
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // setting up voice recognisation
  useEffect(() => {
    function onSpeechResults(e: SpeechResultsEvent) {
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
        try {
          if (await Voice.isRecognizing()) await Voice.stop();
        } catch (e) {}
        setIsListening(false);
      } else {
        setViewSheet(true);
        setResults([]);
        await Voice.start("en-IN");
        setIsListening(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const fetchResponse = useCallback(async () => {
    console.log("making request");
    try {
      const newId = shortid.generate();
      console.log(storyId);

      dispatch(
        addMessage({
          id: newId,
          message: results[0],
          sender: "us",
        })
      );
      const res = await axios.post(
        urlAI + "/webhooks/rest/webhook/",
        {
          sender: "sam" + storyId,
          message: results[0],
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (res.status === 200) {
        if (res.data[0]?.custom?.response_type === "add_task") {
          const newId = shortid.generate();
          dispatch(
            addTask({
              id: newId,
              subject: "new Task - " + newId,
              done: false,
            })
          );
        }
        if (res.data[0]?.custom?.response_type === "list_tasks") {
          const Payload = res.data[0].custom.payload;
          const newTaskList = Payload.map((task: any) => ({
            id: task.id,
            subject: task.heading,
            done: task.status === "Unfinished" ? false : true,
          }));

          dispatch(updateTaskList(newTaskList));
        }

        if (res.data[0]?.custom?.response_type === "update_task") {
        }

        if (res.data[0]?.text) {
          Speech.speak(res.data[0].text);
          dispatch(
            addMessage({
              id: newId,
              message: res.data[0].text,
              sender: "ai",
            })
          );
        } else {
          Speech.speak(res.data[0]?.custom?.voiceovertext || "sorry");
          dispatch(
            addMessage({
              id: newId,
              message: res.data[0]?.custom?.voiceovertext || "sorry",
              sender: "ai",
            })
          );
        }
        setIsListening(false);
      } else {
        Speech.speak("Sorry, Could not understand");
        dispatch(
          addMessage({
            id: newId,
            message: "Sorry, Could not understand",
            sender: "ai",
          })
        );
        setIsListening(false);
      }
    } catch (e) {
      Speech.speak("Sorry, try again");
      bottomSheetRef.current?.snapToPosition("40%");

      setIsListening(false);
      dispatch(
        addMessage({
          id: "error" + shortid.generate(),
          message: "Sorry, try again",
          sender: "ai",
        })
      );
      setResults([]);
    }
  }, [results]);

  useEffect(() => {
    if (results.length > 1) fetchResponse();
  }, [results]);

  useEffect(() => {
    dispatch(filterTaskByStatus(filter));
  }, [filter]);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["40%"], []);

  const [viewSheet, setViewSheet] = useState(false);

  return (
    <Center
      _dark={{ bg: "blueGray.900" }}
      _light={{ bg: "blueGray.50" }}
      px={5}
      flex={1}
    >
      <GreetingTab />
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
        marginY={3}
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
        bottom={1}
        renderInPortal={true}
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
        zIndex={50}
        colorScheme={useColorModeValue("blue", "darkBlue")}
        bg={useColorModeValue("blue.500", "blue.500")}
        onPress={toggleListening}
      />
      {!viewSheet && (
        <>
          <Fab
            position="absolute"
            placement="bottom-right"
            bottom={1}
            zIndex={50}
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
        </>
      )}
      <BottomSheet
        ref={bottomSheetRef}
        index={viewSheet ? 0 : -1}
        snapPoints={snapPoints}
        keyboardBehavior="interactive"
        enablePanDownToClose
        handleIndicatorStyle={{
          backgroundColor: "white",
        }}
        backgroundComponent={(props) => (
          <LinearGradient
            colors={["#0c8ce9", "#fff", "#fff"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "100%",
              borderTopRightRadius: 35,
              borderTopLeftRadius: 35,
              // zIndex: 100,
            }}
          ></LinearGradient>
        )}
        onClose={() => {
          setViewSheet(false), dispatch(resetStory());
        }}
      >
        <ChatScreen />
      </BottomSheet>
    </Center>
  );
}
