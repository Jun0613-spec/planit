import React from "react";

import TaskSwitcher from "@/app/(main)/_components/tasks/task-switcher";

const TasksPage = () => {
  return (
    <div className="h-full flex flex-col">
      <TaskSwitcher />
    </div>
  );
};

export default TasksPage;
