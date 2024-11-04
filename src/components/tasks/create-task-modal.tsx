"use client";

import React from "react";

import ResponsiveModal from "../responsive-modal";

import useCreateTaskModal from "@/hooks/tasks/use-create-task-modal";
import CreateTaskFormWrapper from "./create-task-form-wrapper";

const CreateTaskModal = () => {
  const { isOpen, setIsOpen, onClose } = useCreateTaskModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={onClose} />
    </ResponsiveModal>
  );
};

export default CreateTaskModal;
