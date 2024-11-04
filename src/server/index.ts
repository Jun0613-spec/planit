import { Hono, Context } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { AuthConfig, initAuthConfig } from "@hono/auth-js";

import auth from "@/server/routes/auth";
import workspaces from "@/server/routes/workspaces";
import users from "@/server/routes/users";
import members from "@/server/routes/members";
import projects from "@/server/routes/projects";
import tasks from "@/server/routes/tasks";

import authConfig from "@/auth.config";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
});

const getAuthConfig = (c: Context): AuthConfig => {
  return {
    secret: c.env.AUTH_SECRET,
    ...authConfig
  };
};

const app = new Hono().basePath("/api");

app.use(cors());
app.use("*", initAuthConfig(getAuthConfig));

app.get("/protected", async (c) => {
  const auth = await c.get("authUser");

  return c.json(auth);
});

const routes = app
  .route("/", auth)
  .route("/workspaces", workspaces)
  .route("/users", users)
  .route("/members", members)
  .route("/projects", projects)
  .route("/tasks", tasks);

export const httpHandler = handle(routes);

export type AppType = typeof routes;
