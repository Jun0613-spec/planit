import React from "react";
import { differenceInDays, format } from "date-fns";

import { cn } from "@/lib/utils";

interface TaskDateProps {
  value: string;
  className?: string;
}

const TaskDate = ({ value, className }: TaskDateProps) => {
  const today = new Date();
  const dueDate = new Date(value);
  const isOverdue = differenceInDays(today, dueDate) > 0;
  const daysUntilDue = differenceInDays(dueDate, today);

  let textColor = "text-muted-foreground";

  if (isOverdue) {
    textColor = "text-indigo-600 dark:text-indigo-500";
  } else if (daysUntilDue <= 3) {
    textColor = "text-red-600 dark:text-red-500";
  } else if (daysUntilDue <= 7) {
    textColor = "text-amber-600 dark:text-amber-500";
  } else if (daysUntilDue <= 14) {
    textColor = "text-yellow-600 dark:text-yellow-500";
  }

  return (
    <div className={textColor}>
      <span className={cn("truncate", className)}>{format(value, "PPP")}</span>
    </div>
  );
};

export default TaskDate;
