import React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import PerformanceCard from "./performance-card";

import { ProjectPerformanceResponseType } from "@/hooks/projects/use-get-project-performance";

const Performance = ({ data }: ProjectPerformanceResponseType) => {
  if (!data) return null;

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="flex w-full flex-row">
        <div className="flex items-center flex-1">
          <PerformanceCard
            title="Total tasks"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.taskDifference}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <PerformanceCard
            title="Assigned tasks"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.assignedTaskDifference}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <PerformanceCard
            title="Completed tasks"
            value={data.completedTaskCount}
            variant={data.completedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.completedTaskDifference}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <PerformanceCard
            title="Overdue tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.overdueTaskDifference}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <PerformanceCard
            title="In Completed tasks"
            value={data.inCompletedTaskCount}
            variant={data.inCompletedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.inCompletedTaskDifference}
          />
          <Separator orientation="vertical" />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Performance;
