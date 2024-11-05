import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { verifyAuth } from "@hono/auth-js";
import { and, desc, eq, gte, lt, lte, ne } from "drizzle-orm";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import {
  createProjectSchema,
  getProjectsByWorkspaceSchema,
  updateProjectSchema
} from "@/lib/zod";
import { uploadImage } from "@/lib/upload-image";

import { db } from "@/db/drizzle";
import { members, projects, tasks } from "@/db/schema";

import { MemberRole, Project, TaskStatus } from "@/types";

const app = new Hono()
  .get(
    "/",
    verifyAuth(),
    zValidator("query", getProjectsByWorkspaceSchema),
    async (c) => {
      const auth = c.get("authUser");
      const authUserId = auth.token?.id;

      if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

      const workspaceId =
        c.req.valid("query").workspaceId || c.req.param("workspaceId");

      if (!workspaceId) return c.json({ error: "Missing workspaceId" }, 400);

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

        const projectList = await db
          .select()
          .from(projects)
          .where(eq(projects.workspaceId, workspaceId))
          .orderBy(desc(projects.createdAt))
          .execute();

        if (!projectList)
          return c.json({ error: "No projects found for this workspace" }, 404);

        return c.json({ data: projectList });
      } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to get projects" }, 500);
      }
    }
  )
  .get("/:projectId", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    const projectId = c.req.param("projectId");

    try {
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .execute();

      if (!project) return c.json({ error: "Project notf found" }, 404);

      const workspaceMember = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.userId, authUserId),
            eq(members.workspaceId, project[0].workspaceId)
          )
        )
        .execute();

      if (!workspaceMember) return c.json({ error: "Unauthorized" }, 403);

      return c.json({ data: project[0] });
    } catch (error) {
      console.log(error);
      return c.json({ message: "Failed to get a project" }, 500);
    }
  })
  .get("/:projectId/performance", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    const { projectId } = c.req.param();

    try {
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .execute();

      if (!project) return c.json({ error: "Project not found" }, 404);

      const member = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.userId, authUserId),
            eq(members.workspaceId, project[0].workspaceId)
          )
        )
        .execute();

      if (!member.length) return c.json({ error: "Unauthorized" }, 401);

      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const thisMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      const thisMonthTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, projectId),
            gte(tasks.createdAt, thisMonthStart),
            lte(tasks.createdAt, thisMonthEnd)
          )
        )
        .execute();

      const lastMonthTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, projectId),
            gte(tasks.createdAt, lastMonthStart),
            lte(tasks.createdAt, lastMonthEnd)
          )
        )
        .execute();

      const taskCount = thisMonthTasks.length;
      const taskDifference = taskCount - lastMonthTasks.length;

      const thisMonthAssignedTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, projectId),
            eq(tasks.assigneeId, member[0].id),
            gte(tasks.createdAt, thisMonthStart),
            lte(tasks.createdAt, thisMonthEnd)
          )
        )
        .execute();

      const lastMonthAssignedTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, projectId),
            eq(tasks.assigneeId, member[0].id),
            gte(tasks.createdAt, lastMonthStart),
            lte(tasks.createdAt, lastMonthEnd)
          )
        )
        .execute();

      const assignedTaskCount = thisMonthAssignedTasks.length;
      const assignedTaskDifference =
        assignedTaskCount - lastMonthAssignedTasks.length;

      const thisMonthInCompletedTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, projectId),
            ne(tasks.status, TaskStatus.DONE),
            gte(tasks.createdAt, thisMonthStart),
            lte(tasks.createdAt, thisMonthEnd)
          )
        )
        .execute();

      const lastMonthInCompletedTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, projectId),
            ne(tasks.status, TaskStatus.DONE),
            gte(tasks.createdAt, lastMonthStart),
            lte(tasks.createdAt, lastMonthEnd)
          )
        )
        .execute();

      const inCompletedTaskCount = thisMonthInCompletedTasks.length;
      const inCompletedTaskDifference =
        inCompletedTaskCount - lastMonthInCompletedTasks.length;

      const thisMonthCompletedTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, projectId),
            eq(tasks.status, TaskStatus.DONE),
            gte(tasks.createdAt, thisMonthStart),
            lte(tasks.createdAt, thisMonthEnd)
          )
        )
        .execute();

      const lastMonthCompletedTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, projectId),
            eq(tasks.status, TaskStatus.DONE),
            gte(tasks.createdAt, lastMonthStart),
            lte(tasks.createdAt, lastMonthEnd)
          )
        )
        .execute();

      const completedTaskCount = thisMonthCompletedTasks.length;
      const completedTaskDifference =
        completedTaskCount - lastMonthCompletedTasks.length;

      const thisMonthOverdueTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, projectId),
            ne(tasks.status, TaskStatus.DONE),
            lt(tasks.dueDate, now),
            gte(tasks.createdAt, thisMonthStart),
            lte(tasks.createdAt, thisMonthEnd)
          )
        )
        .execute();

      const lastMonthOverdueTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, projectId),
            ne(tasks.status, TaskStatus.DONE),
            lt(tasks.dueDate, now),
            gte(tasks.createdAt, lastMonthStart),
            lte(tasks.createdAt, lastMonthEnd)
          )
        )
        .execute();

      const overdueTaskCount = thisMonthOverdueTasks.length;
      const overdueTaskDifference =
        overdueTaskCount - lastMonthOverdueTasks.length;

      return c.json({
        data: {
          taskCount,
          taskDifference,
          assignedTaskCount,
          assignedTaskDifference,
          completedTaskCount,
          completedTaskDifference,
          inCompletedTaskCount,
          inCompletedTaskDifference,
          overdueTaskCount,
          overdueTaskDifference
        }
      });
    } catch (error) {
      console.log(error);
      return c.json({ error: "Failed to fetch project performance" }, 500);
    }
  })
  .post(
    "/",
    verifyAuth(),
    zValidator("form", createProjectSchema),
    async (c) => {
      const auth = c.get("authUser");
      const authUserId = auth.token?.id;

      if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

      const { name, image, workspaceId } = c.req.valid("form");

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

        if (!workspaceMember.length)
          return c.json({ error: "No member found in this workspace" }, 403);

        let uploadedImage: string | undefined;

        if (image instanceof File) {
          uploadedImage = await uploadImage(image);
        }

        const project = await db
          .insert(projects)
          .values({
            name,
            image: uploadedImage,
            workspaceId,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .returning();

        if (!project[0]) return c.json({ error: "Something went wrong" }, 400);

        return c.json({
          message: "Project has been created",
          data: project[0]
        });
      } catch (error) {
        console.log(error);
        return c.json({ message: "Failed to create project" }, 500);
      }
    }
  )
  .patch(
    "/:projectId",
    verifyAuth(),
    zValidator("form", updateProjectSchema),
    async (c) => {
      const auth = c.get("authUser");
      const authUserId = auth.token?.id;

      if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      try {
        const existingProject: Project[] = await db
          .select()
          .from(projects)
          .where(eq(projects.id, projectId))
          .execute();

        if (!existingProject)
          return c.json({ error: "Project not found" }, 404);

        const workspaceMember = await db
          .select()
          .from(members)
          .where(
            and(
              eq(members.workspaceId, existingProject[0].workspaceId),
              eq(members.userId, authUserId)
            )
          )
          .execute();

        if (!workspaceMember || workspaceMember[0].role !== MemberRole.ADMIN)
          return c.json({ error: "Unauthorized" }, 403);

        let uploadedImage: string | undefined;

        if (image instanceof File) {
          uploadedImage = await uploadImage(image);
        } else if (typeof image === "string") {
          uploadedImage = image;
        }

        const updatedProject = await db
          .update(projects)
          .set({
            name,
            image: uploadedImage,
            workspaceId: existingProject[0].workspaceId,
            updatedAt: new Date()
          })
          .where(eq(projects.id, projectId))
          .returning();

        if (!updatedProject[0])
          return c.json({ error: "Something went wrong" }, 400);

        return c.json({
          message: "Project has been updated",
          data: updatedProject[0]
        });
      } catch (error) {
        console.log(error);
        return c.json({ error: "Failed to update project" }, 500);
      }
    }
  )
  .delete("/:projectId", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    const { projectId } = c.req.param();

    try {
      const project: Project[] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .execute();

      if (!project) return c.json({ error: "Project not found" }, 404);

      const workspaceMember = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.workspaceId, project[0].workspaceId),
            eq(members.userId, authUserId)
          )
        )
        .execute();

      if (!workspaceMember || workspaceMember[0].role !== MemberRole.ADMIN)
        return c.json({ error: "Unauthorized" }, 403);

      await db.delete(projects).where(eq(projects.id, projectId)).execute();

      return c.json({
        data: project[0],
        message: "Project has been deleted"
      });
    } catch (error) {
      console.log(error);
      return c.json({ error: "Failed to delete the project" }, 500);
    }
  });

export default app;
