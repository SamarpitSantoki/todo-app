import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import AboutScreen from "./screens/about-screen";
import MainScreen from "./screens/main";
const Drawer = createDrawerNavigator();

const Routes = () => {
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
