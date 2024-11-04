import { useWorkspaceModalStore } from "@/stores/modal-store";

const useCreateWorkspaceModal = () => {
  const { isOpen, setIsOpen, onOpen, onClose } = useWorkspaceModalStore();

  return {
    isOpen,
    setIsOpen,
    onOpen,
    onClose
  };
};

export default useCreateWorkspaceModal;
