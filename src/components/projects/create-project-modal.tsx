"use client";

import React from "react";

import ResponsiveModal from "@/components/responsive-modal";

import CreateProjectForm from "./create-project-form";

import useCreateProjectModal from "@/hooks/projects/use-create-project-modal";

const CreateProjectModal = () => {
  const { isOpen, setIsOpen, onClose } = useCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={onClose} />
    </ResponsiveModal>
  );
};

export default CreateProjectModal;
