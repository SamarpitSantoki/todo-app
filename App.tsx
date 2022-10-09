import { StyleSheet } from "react-native";
import AppContainer from "./src/components/app-container";
import Navigator from "./src/";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
export default function App() {
  return (
    <Provider store={store}>
      <AppContainer>
        <Navigator />
      </AppContainer>
    </Provider>
  );
}
