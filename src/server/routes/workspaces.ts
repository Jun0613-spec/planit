import { Hono } from "hono";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { zValidator } from "@hono/zod-validator";
import { verifyAuth } from "@hono/auth-js";
import { and, desc, eq, gte, inArray, lt, lte, ne } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { members, tasks, workspaces } from "@/db/schema";

import {
  createWorkspaceSchema,
  joinWorkspaceSchema,
  updateWorkspaceSchema
} from "@/lib/zod";
import { uploadImage } from "@/lib/upload-image";
import { generateInviteCode } from "@/lib/utils";

import { MemberRole, TaskStatus, Workspace } from "@/types";

const app = new Hono()
  .get("/", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ message: "Unauthorized" }, 401);

    try {
      const workspaceMembers = await db
        .select()
        .from(members)
        .where(eq(members.userId, authUserId))
        .execute()
        .then((results) =>
          results.map((member) => ({
            ...member,
            role: member.role as MemberRole
          }))
        );

      if (!workspaceMembers || workspaceMembers.length === 0) {
        return c.json({ data: [] }, 200);
      }

      const workspaceIds = workspaceMembers.map((member) => member.workspaceId);

      const userWorkspaces = await db
        .select()
        .from(workspaces)
        .where(inArray(workspaces.id, workspaceIds))
        .orderBy(desc(workspaces.createdAt))
        .execute();

      return c.json({ data: userWorkspaces });
    } catch (error) {
      console.error(error);
      return c.json({ message: "Failed to get workspaces" }, 500);
    }
  })
  .get("/:workspaceId", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ message: "Unauthorized" }, 401);

    const { workspaceId } = c.req.param();

    try {
      const member = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.workspaceId, workspaceId),
            eq(members.userId, authUserId)
          )
        )
        .execute();

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const workspace = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, workspaceId))
        .execute();

      if (!workspace.length)
        return c.json({ error: "Workspace not found" }, 404);

      return c.json({ data: workspace[0] });
    } catch (error) {
      console.log(error);
      return c.json({ error: "Failed to fetch a workspace" }, 500);
    }
  })
  .get("/:workspaceId/info", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ message: "Unauthorized" }, 401);

    const { workspaceId } = c.req.param();

    try {
      const workspace = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, workspaceId))
        .execute();

      if (!workspace) return c.json({ error: "Workspace not found" }, 404);

      return c.json({
        data: {
          id: workspace[0].id,
          name: workspace[0].name,
          image: workspace[0].image
        }
      });
    } catch (error) {
      console.log(error);
      return c.json({ error: "Failed to fetch a workspace info" }, 500);
    }
  })
  .get("/:workspaceId/performance", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ message: "Unauthorized" }, 401);

    const { workspaceId } = c.req.param();

    try {
      const member = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.workspaceId, workspaceId),
            eq(members.userId, authUserId)
          )
        )
        .execute();

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const thisMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      const thisMonthsTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, workspaceId),
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
            eq(tasks.workspaceId, workspaceId),
            gte(tasks.createdAt, lastMonthStart),
            lte(tasks.createdAt, lastMonthEnd)
          )
        )
        .execute();

      const taskCount = thisMonthsTasks.length;
      const taskDifference = taskCount - lastMonthTasks.length;

      const thisMonthAssignedTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, workspaceId),
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
            eq(tasks.workspaceId, workspaceId),
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
            eq(tasks.workspaceId, workspaceId),
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
            eq(tasks.workspaceId, workspaceId),
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
            eq(tasks.workspaceId, workspaceId),
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
            eq(tasks.workspaceId, workspaceId),
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
            eq(tasks.workspaceId, workspaceId),
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
            eq(tasks.workspaceId, workspaceId),
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
      return c.json({ error: "Failed to fetch a workspace performance" }, 500);
    }
  })
  .post(
    "/",
    verifyAuth(),
    zValidator("form", createWorkspaceSchema),
    async (c) => {
      const auth = c.get("authUser");
      const authUserId = auth.token?.id;

      if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

      const { name, image } = c.req.valid("form");

      try {
        let uploadedImage: string | undefined;

        if (image instanceof File) {
          uploadedImage = await uploadImage(image);
        }

        const workspace = await db
          .insert(workspaces)
          .values({
            name,
            userId: authUserId,
            image: uploadedImage,
            inviteCode: generateInviteCode(6),
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .returning();

        if (!workspace[0])
          return c.json({ error: "Something went wrong" }, 400);

        await db.insert(members).values({
          userId: authUserId,
          workspaceId: workspace[0].id,
          role: MemberRole.ADMIN
        });

        return c.json({
          message: "Workspace has been created",
          data: workspace[0]
        });
      } catch (error) {
        console.log(error);
        return c.json({ message: "Failed to create workspace" }, 400);
      }
    }
  )
  .patch(
    "/:workspaceId",
    verifyAuth(),
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const auth = c.get("authUser");
      const authUserId = auth.token?.id;

      if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      try {
        const member = await db
          .select()
          .from(members)
          .where(
            and(
              eq(members.workspaceId, workspaceId),
              eq(members.userId, authUserId)
            )
          )
          .execute();

        if (!member || member[0].role !== MemberRole.ADMIN)
          return c.json({ error: "Unauthorized" }, 403);

        let uploadedImage: string | undefined;

        if (image instanceof File) {
          uploadedImage = await uploadImage(image);
        } else if (typeof image === "string") {
          uploadedImage = image;
        }

        const updatedWorkspace = await db
          .update(workspaces)
          .set({
            name,
            image: uploadedImage,
            updatedAt: new Date()
          })
          .where(eq(workspaces.id, workspaceId))
          .returning();

        if (!updatedWorkspace[0])
          return c.json({ error: "Workspace not found" }, 404);

        return c.json({
          data: updatedWorkspace[0],
          message: "Workspace has been updated"
        });
      } catch (error) {
        console.log(error);
        return c.json({ error: "Failed to update workspace" }, 400);
      }
    }
  )
  .delete("/:workspaceId", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    const { workspaceId } = c.req.param();

    try {
      const member = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.workspaceId, workspaceId),
            eq(members.userId, authUserId)
          )
        )
        .execute();

      if (!member || member[0].role !== MemberRole.ADMIN)
        return c.json({ error: "Unauthorized" }, 403);

      await db
        .delete(workspaces)
        .where(eq(workspaces.id, workspaceId))
        .execute();

      return c.json({
        data: { id: workspaceId },
        message: "Workspace has been deleted"
      });
    } catch (error) {
      console.log(error);
      return c.json({ error: "Failed to delete workspace" }, 500);
    }
  })
  .post("/:workspaceId/reset-invite-code", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    const { workspaceId } = c.req.param();

    try {
      const member = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.workspaceId, workspaceId),
            eq(members.userId, authUserId)
          )
        )
        .execute();

      if (!member || member[0].role !== "ADMIN")
        return c.json(
          { error: "Only admin users can reset the invite code" },
          403
        );

      const newInviteCode = generateInviteCode(6);

      const updatedWorkspace = await db
        .update(workspaces)
        .set({
          inviteCode: newInviteCode,
          updatedAt: new Date()
        })
        .where(eq(workspaces.id, workspaceId))
        .returning()
        .execute();

      if (!updatedWorkspace[0])
        return c.json({ error: "Workspace could not be found" }, 404);

      return c.json({
        data: updatedWorkspace[0],
        message: "Invite code has been reset"
      });
    } catch (error) {
      console.log(error);
      return c.json({ error: "Unable to reset invite code" }, 500);
    }
  })
  .post(
    "/:workspaceId/join",
    verifyAuth(),
    zValidator("json", joinWorkspaceSchema),
    async (c) => {
      const auth = c.get("authUser");
      const authUserId = auth.token?.id;

      if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      try {
        const existingMember = await db
          .select()
          .from(members)
          .where(
            and(
              eq(members.workspaceId, workspaceId),
              eq(members.userId, authUserId)
            )
          )
          .execute();

        if (existingMember.length > 0)
          return c.json({ error: "Already a member of workspace" }, 400);

        const workspace: Workspace[] = await db
          .select()
          .from(workspaces)
          .where(eq(workspaces.id, workspaceId))
          .execute();

        if (!workspace) return c.json({ message: "Workspace not found" }, 404);

        if (workspace[0].inviteCode !== code)
          return c.json({ message: "Invalid invite code" }, 400);

        await db.insert(members).values({
          workspaceId,
          userId: authUserId,
          role: MemberRole.MEMBER,
          createdAt: new Date()
        });

        return c.json({
          data: workspace[0],
          message: "You have been joined to the workspace "
        });
      } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to join workspace" }, 500);
      }
    }
  );

export default app;
