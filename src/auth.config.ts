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
      async authorize(credentials) {
        const validatedFields = signinSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        const query = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        const user = query[0];

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) return null;

        return user;
      }
    }),
    GitHub,
    Google
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    session({ session, token }) {
      if (token.id) session.user.id = token.id;

      return session;
    },
    jwt({ token, user }) {
      if (user) token.id = user.id;

      return token;
    }
  }
} satisfies NextAuthConfig;
