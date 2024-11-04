import { useEditTaskModalStore } from "@/stores/tasks/use-edit-task-modal-store";

const useEditTaskModal = () => {
  const { isOpen, taskId, onOpen, onClose, setTaskId } =
    useEditTaskModalStore();

  return {
    isOpen,
    taskId,
    onOpen,
    onClose,
    setTaskId
  };
};

export default useEditTaskModal;
