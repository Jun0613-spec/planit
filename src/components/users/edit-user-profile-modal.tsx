"use client";

import React from "react";

import ResponsiveModal from "@/components/responsive-modal";

import EditUserProfileForm from "./edit-user-profile-form";

import useEditUserProfileModal from "@/hooks/users/use-edit-user-profile-modal";

const EditUserProfileModal = () => {
  const { isOpen, setIsOpen, onClose } = useEditUserProfileModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <EditUserProfileForm onCancel={onClose} />
    </ResponsiveModal>
  );
};

export default EditUserProfileModal;
