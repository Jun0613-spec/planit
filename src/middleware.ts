import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT
} from "./lib/routes";

const authMiddleware = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (nextUrl.pathname.startsWith(apiAuthPrefix)) return;

  if (!isLoggedIn && nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/landing", nextUrl));
  }

  if (isLoggedIn && nextUrl.pathname === "/landing") {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }
});

export default function middleware(req: NextRequest) {
  return authMiddleware(req, {});
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"]
};
