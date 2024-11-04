"use client";

import React from "react";

import ResponsiveModal from "@/components/responsive-modal";

import EditProjectForm from "./edit-project-form";

import useEditProjectModal from "@/hooks/projects/use-edit-project-modal";

const EditProjectModal = () => {
  const { isOpen, setIsOpen, onClose } = useEditProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <EditProjectForm onCancel={onClose} />
    </ResponsiveModal>
  );
};

export default EditProjectModal;
