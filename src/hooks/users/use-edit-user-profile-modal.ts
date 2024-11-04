import { useEditUserProfileModalStore } from "@/stores/modal-store";

const useEditUserProfileModal = () => {
  const { isOpen, setIsOpen, onOpen, onClose } = useEditUserProfileModalStore();

  return {
    isOpen,
    setIsOpen,
    onOpen,
    onClose
  };
};

export default useEditUserProfileModal;
