import { JWT as DefaultJWT } from "next-auth/jwt";

import { users } from "./db/schema";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: (typeof users.$inferSelect)["id"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    id: (typeof users.$inferSelect)["id"];
  }
}
