import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

import { uploadImage } from "@/lib/upload-image";
import { updateUserSchema } from "@/lib/zod";

const app = new Hono()
  .get("/", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, authUserId))
        .execute();

      if (!existingUser) return c.json({ message: "User not found" }, 404);

      return c.json({
        data: existingUser[0]
      });
    } catch (error) {
      console.error(error);
      return c.json({ message: "Failed to retrieve user" }, 500);
    }
  })
  .patch("/", verifyAuth(), zValidator("form", updateUserSchema), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    const { name, image } = c.req.valid("form");

    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, authUserId))
        .execute();

      if (!existingUser) return c.json({ message: "User not found" }, 404);

      let uploadedImage: string | undefined;

      if (image instanceof File) {
        uploadedImage = await uploadImage(image);
      }

      const updatedUser = await db
        .update(users)
        .set({
          name: name || existingUser[0].name,
          image: uploadedImage || existingUser[0].image
        })
        .where(eq(users.id, authUserId))
        .returning();

      if (!updatedUser) return c.json({ message: "User not found" }, 404);

      return c.json({
        message: "User has been updated",
        data: updatedUser[0]
      });
    } catch (error) {
      console.log(error);
      return c.json({ message: "Failed to update user" }, 500);
    }
  })
  .delete("/", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const authUserId = auth.token?.id;

    if (!authUserId) return c.json({ error: "Unauthorized" }, 401);

    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, authUserId))
        .execute();

      if (!existingUser) return c.json({ message: "User not found" }, 404);

      const deletingUser = await db
        .delete(users)
        .where(eq(users.id, authUserId))
        .returning();

      if (!deletingUser)
        return c.json({ message: "Failed to delete user" }, 400);

      return c.json({
        message: "User and associated data have been deleted successfully",
        data: deletingUser[0]
      });
    } catch (error) {
      console.error(error);
      return c.json({ message: "Failed to delete user" }, 500);
    }
  });

export default app;
