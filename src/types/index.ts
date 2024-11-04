export interface User {
  name: string;
  image?: string | null;
  email?: string;
  password?: string;
  id: string;
  emailVerified?: string;
}

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER"
}

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE"
}

export type Member = User & {
  workspaceId: string;
  userId: string;
  role: MemberRole;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type AssingeeUser = {
  id: string;
  name: string;
  image?: string | null;
  role: MemberRole;
};

export type Workspace = {
  id: string;
  name: string;
  image: string | null;
  inviteCode: string;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Project = {
  workspaceId: string;
  id: string;
  name: string;
  image: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Task = {
  id: string;
  name: string;
  status: TaskStatus;
  assigneeId: string;
  projectId: string;
  position: number;
  dueDate: Date | null;
  description?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type PopulatedTask = Task & {
  project: Project;
  assignee: AssingeeUser;
};

export interface ErrorResponse {
  error?: string;
  message?: string;
}
