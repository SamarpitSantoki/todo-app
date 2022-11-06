import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAppDispatch, useAppSelector } from "./hooks/storeHooks";
import { GET_TASK_LIST, saveToLocalStorage } from "./redux/taskSlice";
import AboutScreen from "./screens/about-screen";
import MainScreen from "./screens/main";
const Drawer = createDrawerNavigator();

const Routes = () => {
  const appState = useRef(AppState.currentState);
  const taskList = useAppSelector(GET_TASK_LIST);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(saveToLocalStorage(taskList));
  }, [taskList]);

  return (
    <NavigationContainer
      documentTitle={{
        enabled: true,
      }}
    >
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Drawer.Screen name="Main" component={MainScreen} />
        <Drawer.Screen name="About" component={AboutScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
export default Routes;
