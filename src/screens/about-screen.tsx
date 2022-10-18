import { Box, Input, Text, View, VStack } from "native-base";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import { setUrl } from "../redux/backendSlice";
const AboutScreen = () => {
  const url = useAppSelector((state) => state.backend.url);
  const dispatch = useAppDispatch();
  const setUrlAI = (e: string) => dispatch(setUrl(e));
  return (
    <VStack flex={1} padding={3}>
      <View padding={3}>
        <Text>Add Backend URL here</Text>
        <Input value={url} onChangeText={(e) => setUrlAI(e)} />
        <Text bold underline fontSize={20}>
          Response from server
        </Text>
      </View>
    </VStack>
  );
};

export default AboutScreen;
