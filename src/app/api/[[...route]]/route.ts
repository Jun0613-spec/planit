import { httpHandler } from "@/server";

export const runtime = "nodejs";

export {
  httpHandler as GET,
  httpHandler as POST,
  httpHandler as PATCH,
  httpHandler as DELETE,
  httpHandler as PUT
};
