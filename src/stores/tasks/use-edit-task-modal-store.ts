import { create } from "zustand";

interface useEditTaskModalState {
  isOpen: boolean;
  taskId: string | null;
  setTaskId: (id: string | null) => void;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useEditTaskModalStore = create<useEditTaskModalState>((set) => ({
  isOpen: false,
  taskId: null,
  setTaskId: (id) => set({ taskId: id }),
  onOpen: (id) => set({ isOpen: true, taskId: id }),
  onClose: () => set({ isOpen: false, taskId: null })
}));
