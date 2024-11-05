import { z } from "zod";

import { MemberRole, TaskStatus } from "@/types";

//* Auth *//
export const signinSchema = z.object({
  email: z.string().trim().min(1, "Required").email(),
  password: z.string().min(8, "Minumum 8 characters required")
});

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Minumum 8 characters required")
});

//* Workspace *//
export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Minimum 1 character required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value))
    ])
    .optional()
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),

  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value))
    ])
    .optional()
});

export const joinWorkspaceSchema = z.object({
  code: z.string().min(6, {
    message: "Invalid invite code"
  })
});

//* Users *//
export const updateUserSchema = z.object({
  name: z.string().min(1, "Required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value))
    ])
    .optional()
});

//* Members *//
export const getMembersByWorkspaceSchema = z.object({
  workspaceId: z.string()
});

export const updateMemberRoleSchema = z.object({
  role: z.nativeEnum(MemberRole)
});

//* Projects *//
export const getProjectsByWorkspaceSchema = z.object({
  workspaceId: z.string()
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Minimum 1 character required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value))
    ])
    .optional(),
  workspaceId: z.string().trim().min(1, "Workspace ID is required")
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Minimum 1 character required").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value))
    ])
    .optional()
});

//* Tasks *//
export const getTasksSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  status: z.nativeEnum(TaskStatus).nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish()
});

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Minimum 1 character required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1),
  description: z.string().optional()
});

export const updateTaskSchema = z.object({
  name: z.string().trim().min(1, "Minimum 1 character required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1),
  description: z.string().optional()
});

export const moveBoardTasksSchema = z.object({
  taskUpdates: z.array(
    z.object({
      id: z.string(),
      status: z.nativeEnum(TaskStatus),
      position: z.number().int().positive().min(1000).max(1_000_000)
    })
  )
});
