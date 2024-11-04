import { create } from "zustand";

interface TaskViewState {
  view: string;
  setView: (view: string) => void;
}

export const useTaskViewStore = create<TaskViewState>((set) => ({
  view: "table",
  setView: (view) => set({ view })
}));
