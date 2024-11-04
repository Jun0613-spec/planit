import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password")
});

export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaces)
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state")
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId]
    })
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull()
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull()
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token]
    })
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports")
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID]
    })
  })
);

export const workspaces = pgTable("workspace", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade"
    }),
  image: text("image"),
  inviteCode: text("inviteCode").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updatedAt", { mode: "date" }).$defaultFn(
    () => new Date()
  )
});

export const workspacesRelations = relations(workspaces, ({ one }) => ({
  user: one(users, {
    fields: [workspaces.userId],
    references: [users.id]
  })
}));

export const workspacesInsertSchema = createInsertSchema(workspaces);

export const roleEnum = pgEnum("role", ["ADMIN", "MEMBER"]);

export const members = pgTable("member", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  role: roleEnum().notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updatedAt", { mode: "date" }).$defaultFn(
    () => new Date()
  )
});

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id]
  }),
  workspace: one(workspaces, {
    fields: [members.workspaceId],
    references: [workspaces.id]
  })
}));

export const projects = pgTable("project", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updatedAt", { mode: "date" }).$defaultFn(
    () => new Date()
  )
});

export const projectsRelations = relations(projects, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id]
  })
}));

export const projectsInsertSchema = createInsertSchema(projects);

export const statusEnum = pgEnum("status", [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE"
]);

export const tasks = pgTable("task", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  projectId: text("projectId")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  assigneeId: text("assigneeId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: statusEnum().notNull(),
  position: integer("position").notNull(),
  dueDate: timestamp("dueDate", { mode: "date" }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updatedAt", { mode: "date" }).$defaultFn(
    () => new Date()
  )
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [tasks.workspaceId],
    references: [workspaces.id]
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id]
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id]
  })
}));

export const tasksInsertSchema = createInsertSchema(tasks);
