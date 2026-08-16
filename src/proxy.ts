import { NextRequest, NextResponse } from "next/server";

// Public routes (anyone can access)
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/projects",
  "/contact",
  "/github",
  "/articles",
  "/articles/:id",
  "/projects/:id",
  "/cookies-policy",
];

// Regex to match public routes and any sub-paths
const publicPathnameRegex = new RegExp(
  `^(${PUBLIC_ROUTES.map((p) => p.replace(/\//g, "\\/")).join("|")})(/.*)?$`,
  "i",
);

const publicProfileRegex = /^\/(projects|articles)\/\d+(\/.*)?$/i;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const pathnameWithoutLocale =
    pathname.replace(/^\/(en|bn|ar)(?=\/|$)/, "") || "/";
  const token = req.cookies.get("accessToken")?.value;

  const isPublicPage =
    publicPathnameRegex.test(pathnameWithoutLocale) ||
    publicProfileRegex.test(pathnameWithoutLocale);

  // Protect private routes
  if (!isPublicPage && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Everything else is allowed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
