import type { NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";

import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { signinSchema } from "./lib/zod";

import { db } from "./db/drizzle";
import { users } from "./db/schema";

import { eq } from "drizzle-orm";

export default {
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      authorize: async (credentials) => {
        const validatedFields = signinSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        const user = existingUser[0];

        if (!user || !user.password)
          throw new Error("Invalid email or password.");

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) throw new Error("Invalid password.");

        return user;
      }
    }),
    GitHub,
    Google
  ],
  pages: {
    error: "/auth/error"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id;

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        token.id = user.id;

        token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
      }

      if (trigger === "update" && session.user) {
        token = {
          ...token,
          ...session.user
        };
      }

      return token;
    }
  }
} satisfies NextAuthConfig;
