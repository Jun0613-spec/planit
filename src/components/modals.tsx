import React from "react";

import CreateWorkspaceModal from "./workspaces/create-workspace-modal";
import CreateProjectModal from "./projects/create-project-modal";
import EditProjectModal from "./projects/edit-project-modal";
import CreateTaskModal from "./tasks/create-task-modal";
import EditUserProfileModal from "./users/edit-user-profile-modal";
import EditTaskModal from "./tasks/edit-task-modal";

const Modals = () => {
  return (
    <>
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <EditProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <EditUserProfileModal />
    </>
  );
};

export default Modals;
