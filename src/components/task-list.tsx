import { useCallback, useRef } from "react";
import { AnimatePresence, View, ScrollView } from "moti";
import { PanGestureHandlerProps } from "react-native-gesture-handler";
import TaskItem from "./task-item";
import { makeStyledComponent } from "../utils/styled";

const StyledView = makeStyledComponent(View);
const StyledScrollView = makeStyledComponent(ScrollView);

interface TaskItemData {
  id: string;
  subject: string;
  done: boolean;
}

interface TaskListProps {
  data: Array<TaskItemData>;
  editingItemId: string | null;
  onToggleItem: (item: TaskItemData) => void;
  onChangeSubject: (item: TaskItemData, newSubject: string) => void;
  onFinishEditing: (item: TaskItemData) => void;
  onPressLabel: (item: TaskItemData) => void;
  onRemoveItem: (item: TaskItemData) => void;
}

interface TaskItemProps
  extends Pick<PanGestureHandlerProps, "simultaneousHandlers"> {
  data: TaskItemData;
  isEditing: boolean;
  onToggleItem: (item: TaskItemData) => void;
  onChangeSubject: (item: TaskItemData, newSubject: string) => void;
  onFinishEditing: (item: TaskItemData) => void;
  onPressLabel: (item: TaskItemData) => void;
  onRemove: (item: TaskItemData) => void;
}

export const AnimatedTaskItem = (props: TaskItemProps) => {
  const {
    simultaneousHandlers,
    data,
    isEditing,
    onChangeSubject,
    onFinishEditing,
    onRemove,
    onToggleItem,
    onPressLabel,
  } = props;

  const handleToggleCheckbox = useCallback(() => {
    onToggleItem(data);
  }, [data, onToggleItem]);

  const handleChangeSubject = useCallback(
    (subject: string) => {
      onChangeSubject(data, subject);
    },
    [data, onChangeSubject]
  );

  const handleFinishEditing = useCallback(() => {
    onFinishEditing(data);
  }, [data, onFinishEditing]);

  const handlePressLabel = useCallback(() => {
    data;
  }, [data, onPressLabel]);

  const handleRemove = useCallback(() => {
    onRemove(data);
  }, [data, onRemove]);

  return (
    <StyledView
      w="full"
      from={{ opacity: 0, scale: 0.5, marginBottom: -46 }}
      animate={{ opacity: 1, scale: 1, marginBottom: 0 }}
      exit={{ opacity: 0, scale: 0.5, marginBottom: -46 }}
    >
      <TaskItem
        simultaneousHandlers={simultaneousHandlers}
        isDone={data.done}
        subject={data.subject}
        isEditing={isEditing}
        onChangeSubject={handleChangeSubject}
        onFinishedEditing={handleFinishEditing}
        onPressLabel={handlePressLabel}
        onRemove={handleRemove}
        onToggleCheckbox={handleToggleCheckbox}
      />
    </StyledView>
  );
};

export default function TaskList(props: TaskListProps) {
  const {
    data,
    editingItemId,
    onChangeSubject,
    onFinishEditing,
    onPressLabel,
    onRemoveItem,
    onToggleItem,
  } = props;

  const refScrollView = useRef(null);

  return (
    <StyledScrollView ref={refScrollView} w="full">
      {/* @ts-ignore */}
      <AnimatePresence>
        {data.map((item) => {
          const isEditing = item.id === editingItemId;
          return (
            <AnimatedTaskItem
              key={item.id}
              data={item}
              simultaneousHandlers={refScrollView}
              isEditing={item.id === editingItemId}
              onChangeSubject={onChangeSubject}
              onFinishEditing={onFinishEditing}
              onPressLabel={onPressLabel}
              onRemove={onRemoveItem}
              onToggleItem={onToggleItem}
            />
          );
        })}
      </AnimatePresence>
    </StyledScrollView>
  );
}
