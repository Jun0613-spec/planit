import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { signupSchema } from "@/lib/zod";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

const app = new Hono().post(
  "/sign-up",
  zValidator("json", signupSchema),
  async (c) => {
    const { name, email, password } = c.req.valid("json");

    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUser[0])
        return c.json({ error: "Email already in used" }, 400);

      const hashedPassword = await bcrypt.hash(password, 12);

      await db.insert(users).values({
        name,
        email,
        password: hashedPassword
      });

      return c.json({
        message: "Thank you, your account has been successfully created"
      });
    } catch (error) {
      console.log(error);
      return c.json({ message: "Failed to sign up" }, 500);
    }
  }
);

export default app;
