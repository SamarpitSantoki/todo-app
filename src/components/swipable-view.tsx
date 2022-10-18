import { Dimensions } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Box } from "native-base";
import { makeStyledComponent } from "../utils/styled";

const StyledView = makeStyledComponent(Animated.View);

interface Props extends Pick<PanGestureHandlerProps, "simultaneousHandlers"> {
  children: React.ReactNode;
  backView?: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = -SCREEN_WIDTH * 0.2;

const SwipeView = (props: Props) => {
  const {
    children,
    backView,
    onSwipeLeft,
    simultaneousHandlers,
    onSwipeStart,
    onSwipeEnd,
  } = props;
  const translateX = useSharedValue(0);

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = Math.max(-128, Math.min(0, event.translationX));
    },
    onEnd: (event) => {
      const shouldBeDismissed = event.translationX < SWIPE_THRESHOLD;
      if (shouldBeDismissed) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        onSwipeLeft && runOnJS(onSwipeLeft)();
      } else {
        translateX.value = withTiming(0);
      }

      translateX.value = withTiming(0);
    },
  });

  const fascadeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <StyledView w="full">
      {backView && (
        <Box position={"absolute"} left={0} right={0} top={0} bottom={0}>
          {backView}
        </Box>
      )}
      <PanGestureHandler
        onBegan={onSwipeStart}
        onEnded={onSwipeEnd}
        simultaneousHandlers={simultaneousHandlers}
        onGestureEvent={panGesture}
      >
        <StyledView style={fascadeStyle}>{children}</StyledView>
      </PanGestureHandler>
    </StyledView>
  );
};

export default SwipeView;
