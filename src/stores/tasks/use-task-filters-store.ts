import { create } from "zustand";

import { TaskStatus } from "@/types";

interface TaskFiltersState {
  projectId: string;
  status: TaskStatus | null;
  assigneeId: string;
  search: string;
  dueDate: string;
  setFilter: (
    key: keyof Omit<TaskFiltersState, "setFilter">,
    value: string | TaskStatus | null
  ) => void;
}

export const useTaskFiltersStore = create<TaskFiltersState>((set) => ({
  projectId: "",
  status: null,
  assigneeId: "",
  search: "",
  dueDate: "",
  setFilter: (key, value) => set((state) => ({ ...state, [key]: value }))
}));
