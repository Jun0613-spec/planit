import { Hono } from "hono";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, inArray, like } from "drizzle-orm";

import {
  moveBoardTasksSchema,
  createTaskSchema,
  getTasksSchema,
  updateTaskSchema
} from "@/lib/zod";

import { db } from "@/db/drizzle";
import { members, projects, tasks, users } from "@/db/schema";

import { PopulatedTask } from "@/types";

const app = new Hono()
  .get("/", verifyAuth(), zValidator("query", getTasksSchema), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    const { workspaceId, projectId, assigneeId, status, search, dueDate } =
      c.req.valid("query");

    try {
      const workspaceMember = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.workspaceId, workspaceId),
            eq(members.userId, authUserId)
          )
        )
        .execute();

      if (!workspaceMember)
        return c.json({ error: "No member found in this workspace" }, 403);

      const queryConditions = [eq(tasks.workspaceId, workspaceId)];

      if (projectId) queryConditions.push(eq(tasks.projectId, projectId));
      if (status) queryConditions.push(eq(tasks.status, status));
      if (assigneeId) queryConditions.push(eq(tasks.assigneeId, assigneeId));
      if (dueDate) queryConditions.push(eq(tasks.dueDate, new Date(dueDate)));
      if (search) queryConditions.push(like(tasks.name, `%${search}%`));

      const tasksList = await db
        .select()
        .from(tasks)
        .where(and(...queryConditions))
        .orderBy(desc(tasks.createdAt))
        .execute();

      const projectIds = tasksList.map((task) => task.projectId);
      const assigneeIds = tasksList.map((task) => task.assigneeId);

      const projectList = await db
        .select()
        .from(projects)
        .where(inArray(projects.id, projectIds))
        .execute();

      const memberList = await db
        .select()
        .from(members)
        .where(inArray(members.id, assigneeIds))
        .execute();

      const userIds = memberList.map((member) => member.userId);

      const usersById = await db
        .select()
        .from(users)
        .where(inArray(users.id, userIds))
        .execute();

      const assignees = memberList.map((member) => {
        const userDetail = usersById.find((user) => user.id === member.userId);
        return {
          ...member,
          name: userDetail?.name,
          email: userDetail?.email,
          image: userDetail?.image
        };
      });

      const populatedTasks = tasksList.map((task) => {
        const project = projectList.find(
          (project) => project.id === task.projectId
        );
        const assignee = assignees.find(
          (assignee) => assignee.id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee
        } as PopulatedTask;
      });

      return c.json({ data: { documents: populatedTasks } });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Failed to get tasks" }, 500);
    }
  })
  .get("/:taskId", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    const { taskId } = c.req.param();

    try {
      const task = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, taskId))
        .execute();

      if (!task) return c.json({ error: "Task not found" }, 404);

      const workspaceMember = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.workspaceId, task[0].workspaceId),
            eq(members.userId, authUserId)
          )
        )
        .execute();

      if (!workspaceMember)
        return c.json({ error: "No member found in this workspace" }, 403);

      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, task[0].projectId))
        .execute();

      const member = await db
        .select()
        .from(members)
        .where(eq(members.id, task[0].assigneeId))
        .execute();

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, member[0].userId))
        .execute();

      if (!user) return c.json({ error: "User not found" }, 404);

      const assignee = {
        ...member[0],
        name: user[0].name,
        email: user[0].email,
        image: user[0].image
      };

      return c.json({
        data: { ...task[0], project: project[0], assignee } as PopulatedTask
      });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Failed to fetch task details" }, 500);
    }
  })
  .post("/", verifyAuth(), zValidator("json", createTaskSchema), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    const {
      name,
      description,
      status,
      workspaceId,
      projectId,
      dueDate,
      assigneeId
    } = c.req.valid("json");

    try {
      const workspaceMember = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.workspaceId, workspaceId),
            eq(members.userId, authUserId)
          )
        );

      if (!workspaceMember)
        return c.json({ error: "No member found in this workspace" }, 403);

      const highestPositionTask = await db
        .select()
        .from(tasks)
        .where(eq(tasks.workspaceId, workspaceId))
        .orderBy(desc(tasks.position))
        .limit(1)
        .execute();

      const newPosition =
        highestPositionTask.length > 0
          ? highestPositionTask[0].position + 1000
          : 1000;

      const newTask = await db
        .insert(tasks)
        .values({
          name,
          description,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          position: newPosition,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      return c.json({ data: newTask, message: "Task has been created" });
    } catch (error) {
      console.log(error);
      return c.json({ error: "Failed to create a task" }, 500);
    }
  })
  .patch(
    "/:taskId",
    verifyAuth(),
    zValidator("json", updateTaskSchema.partial()),
    async (c) => {
      const auth = c.get("authUser");
      const authUserId = auth.token?.id;

      if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

      const { taskId } = c.req.param();

      const { name, description, status, projectId, dueDate, assigneeId } =
        c.req.valid("json");

      try {
        const existingTask = await db
          .select()
          .from(tasks)
          .where(eq(tasks.id, taskId))
          .execute();

        if (!existingTask) return c.json({ error: "Task not found" }, 404);

        const workspaceMember = await db
          .select()
          .from(members)
          .where(
            and(
              eq(members.workspaceId, existingTask[0].workspaceId),
              eq(members.userId, authUserId)
            )
          )
          .execute();

        if (!workspaceMember)
          return c.json({ error: "No member found in this workspace" }, 403);

        const updatedTask = await db
          .update(tasks)
          .set({
            name,
            description,
            status,
            projectId,
            dueDate,
            assigneeId
          })
          .where(eq(tasks.id, taskId))
          .returning();

        if (!updatedTask[0])
          return c.json({ error: "Something went wrong" }, 400);

        return c.json({
          data: updatedTask[0],
          message: "Task has been updated"
        });
      } catch (error) {
        console.log(error);
        return c.json({ error: "Failed to update the task" }, 500);
      }
    }
  )
  .post(
    "/move-board",
    verifyAuth(),
    zValidator("json", moveBoardTasksSchema),
    async (c) => {
      const auth = c.get("authUser");
      const authUserId = auth.token?.id;

      if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

      const { taskUpdates } = c.req.valid("json");

      try {
        const taskIds = taskUpdates.map((task) => task.id);

        const tasksToUpdate = await db
          .select()
          .from(tasks)
          .where(inArray(tasks.id, taskIds))
          .execute();

        const workspaceIds = new Set(
          tasksToUpdate.map((task) => task.workspaceId)
        );

        if (workspaceIds.size !== 1) {
          return c.json(
            { error: "All tasks must belong to the same workspace" },
            400
          );
        }

        const workspaceId = workspaceIds.values().next().value;

        const workspaceMember = await db
          .select()
          .from(members)
          .where(
            and(
              eq(members.workspaceId, workspaceId as string),
              eq(members.userId, authUserId)
            )
          )
          .execute();

        if (!workspaceMember) {
          return c.json({ error: "No member found in this workspace" }, 403);
        }

        const updatedTasks = [];

        for (const task of taskUpdates) {
          const { id, status, position } = task;
          const updatedTask = await db
            .update(tasks)
            .set({
              status,
              position
            })
            .where(eq(tasks.id, id))
            .returning();

          updatedTasks.push(updatedTask);
        }

        return c.json({ data: updatedTasks, message: "Task has been updated" });
      } catch (error) {
        console.log(error);
        return c.json({ error: "Failed to move board" }, 500);
      }
    }
  )
  .delete("/:taskId", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    const { taskId } = c.req.param();

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    try {
      const existingTask = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, taskId))
        .execute();

      if (!existingTask) return c.json({ error: "Task not found" }, 404);

      const workspaceMember = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.workspaceId, existingTask[0].workspaceId),
            eq(members.userId, authUserId)
          )
        );

      if (!workspaceMember)
        return c.json({ error: "No member found in this workspace" }, 403);

      await db.delete(tasks).where(eq(tasks.id, taskId)).execute();

      return c.json({ message: "Task has been delted", data: existingTask[0] });
    } catch (error) {
      console.log(error);
      return c.json({ error: "Failed to delete the task" }, 500);
    }
  });

export default app;
