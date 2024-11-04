import { create } from "zustand";

interface ModalStoreState {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onOpen: () => void;
  onClose: () => void;
}

const createModalStore = () =>
  create<ModalStoreState>((set) => ({
    isOpen: false,
    setIsOpen: (value) => set({ isOpen: value }),
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
  }));

export const useEditProjectModalStore = createModalStore();
export const useProjectModalStore = createModalStore();
export const useCreateTaskModalStore = createModalStore();
export const useEditUserProfileModalStore = createModalStore();
export const useWorkspaceModalStore = createModalStore();
