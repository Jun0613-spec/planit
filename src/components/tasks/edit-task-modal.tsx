"use client";

import React from "react";

import ResponsiveModal from "../responsive-modal";

import EditTaskFormWrapper from "./edit-task-form-wrapper";
import useEditTaskModal from "@/hooks/tasks/use-edit-task-modal";

const EditTaskModal = () => {
  const { taskId, onClose } = useEditTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={onClose}>
      {taskId && <EditTaskFormWrapper id={taskId} onCancel={onClose} />}
    </ResponsiveModal>
  );
};

export default EditTaskModal;
