import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { verifyAuth } from "@hono/auth-js";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { members, users } from "@/db/schema";

import { getMembersByWorkspaceSchema, updateMemberRoleSchema } from "@/lib/zod";

import { MemberRole } from "@/types";

const app = new Hono()
  .get(
    "/",
    zValidator("query", getMembersByWorkspaceSchema),
    verifyAuth(),
    async (c) => {
      const auth = c.get("authUser");
      const authUserId = auth.token?.id;

      if (!authUserId) return c.json({ message: "Unauthorized" }, 401);

      const { workspaceId } = c.req.valid("query");

      if (!workspaceId) return c.json({ error: "Missing workspaceId" }, 400);

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

        if (!member) return c.json({ error: "No member found" }, 403);

        const workspaceMembers = await db
          .select()
          .from(members)
          .where(eq(members.workspaceId, workspaceId))
          .execute();

        const userIds = workspaceMembers.map((member) => member.userId);

        const userDetails = await db
          .select()
          .from(users)
          .where(inArray(users.id, userIds))
          .execute();

        const populatedMembers = workspaceMembers.map((member) => {
          const userDetail = userDetails.find(
            (user) => user.id === member.userId
          );

          return {
            ...member,
            name: userDetail ? userDetail.name : undefined,
            email: userDetail ? userDetail.email : undefined,
            image: userDetail ? userDetail.image : undefined,
            role: member.role as MemberRole
          };
        });

        return c.json({
          data: populatedMembers
        });
      } catch (error) {
        console.log(error);
        return c.json({ error: "Failed to get members" }, 500);
      }
    }
  )
  .delete("/:memberId", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    const { memberId } = c.req.param();

    try {
      const memberToDelete = await db
        .select()
        .from(members)
        .where(eq(members.id, memberId))
        .execute()
        .then((result) => result[0]);

      if (!memberToDelete) return c.json({ error: "Member not found" }, 404);

      const allMembersInWorkspace = await db
        .select()
        .from(members)
        .where(eq(members.workspaceId, memberToDelete.workspaceId))
        .execute();

      const member = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.workspaceId, memberToDelete.workspaceId),
            eq(members.userId, authUserId)
          )
        )
        .execute()
        .then((result) => result[0]);

      if (!member) return c.json({ error: "Unauthorized" }, 403);

      if (member.id === memberToDelete.id)
        return c.json(
          {
            error: "You cannot remove yourself. Please contact an admin."
          },
          400
        );

      if (member.id !== memberToDelete.id && member.role !== MemberRole.ADMIN)
        return c.json(
          { error: "You do not have permission to delete this member" },
          403
        );

      if (allMembersInWorkspace.length === 1)
        return c.json({ error: "You can not remove the only member" }, 400);

      await db.delete(members).where(eq(members.id, memberId)).execute();

      return c.json({
        data: {
          id: memberToDelete.id,
          workspaceId: memberToDelete.workspaceId
        },
        message: "Member deleted successfully"
      });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Failed to delete member" }, 500);
    }
  })
  .patch(
    "/:memberId",
    verifyAuth(),
    zValidator("json", updateMemberRoleSchema),
    async (c) => {
      const auth = c.get("authUser");
      const authUserId = auth.token?.id;

      if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");

      try {
        const memberToUpdate = await db
          .select()
          .from(members)
          .where(eq(members.id, memberId))
          .execute()
          .then((result) => result[0]);

        if (!memberToUpdate) return c.json({ error: "Member not found" }, 404);

        const allMembersInWorkspace = await db
          .select()
          .from(members)
          .where(eq(members.workspaceId, memberToUpdate.workspaceId))
          .execute();

        const member = await db
          .select()
          .from(members)
          .where(
            and(
              eq(members.workspaceId, memberToUpdate.workspaceId),
              eq(members.userId, authUserId)
            )
          )
          .execute()
          .then((result) => result[0]);

        if (!member)
          return c.json({ error: "You do not have permission" }, 403);

        if (member.role !== MemberRole.ADMIN)
          return c.json({ error: "You do not have permission" }, 403);

        if (role !== MemberRole.ADMIN) {
          const otherAdmins = allMembersInWorkspace.filter(
            (member) => member.role === MemberRole.ADMIN
          );

          if (otherAdmins.length <= 1)
            return c.json(
              { error: "There must be at least one admin in the workspace" },
              400
            );
        }

        if (allMembersInWorkspace.length === 1) {
          return c.json({ error: "At least one member must remain" }, 400);
        }

        await db
          .update(members)
          .set({ role: role, updatedAt: new Date() })
          .where(eq(members.id, memberId))
          .returning();

        return c.json({
          data: {
            id: memberToUpdate.id,
            workspaceId: memberToUpdate.workspaceId
          },
          message: "Member role has been updated"
        });
      } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to update member role" }, 500);
      }
    }
  );

export default app;
