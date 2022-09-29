import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import theme from "../theme";
type Props = {
  children: React.ReactNode;
};

export default function AppContainer(prop: Props) {
  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>{prop.children}</NativeBaseProvider>
    </NavigationContainer>
  );
}
