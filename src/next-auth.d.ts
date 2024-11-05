import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string | undefined;
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    id: string | undefined;
  }
}
