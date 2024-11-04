import { useCreateTaskModalStore } from "@/stores/modal-store";

const useCreateTaskModal = () => {
  const { isOpen, setIsOpen, onOpen, onClose } = useCreateTaskModalStore();

  return {
    isOpen,
    setIsOpen,
    onOpen,
    onClose
  };
};

export default useCreateTaskModal;
