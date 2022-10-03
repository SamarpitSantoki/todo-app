import { createDrawerNavigator } from "@react-navigation/drawer";
import { View } from "native-base";
import AboutScreen from "./screens/about-screen";
import MainScreen from "./screens/main";
const Drawer = createDrawerNavigator();

const Routes = () => {
  return (
    <Drawer.Navigator initialRouteName="Main">
      <Drawer.Screen name="Main" component={MainScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
};
export default Routes;
