import { useProjectModalStore } from "@/stores/modal-store";

const useCreateProjectModal = () => {
  const { isOpen, setIsOpen, onOpen, onClose } = useProjectModalStore();

  return {
    isOpen,
    setIsOpen,
    onOpen,
    onClose
  };
};

export default useCreateProjectModal;
