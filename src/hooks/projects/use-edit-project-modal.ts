import { useEditProjectModalStore } from "@/stores/modal-store";

const useEditProjectModal = () => {
  const { isOpen, setIsOpen, onOpen, onClose } = useEditProjectModalStore();

  return {
    isOpen,
    setIsOpen,
    onOpen,
    onClose
  };
};

export default useEditProjectModal;
