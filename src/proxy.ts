import { NextRequest, NextResponse } from "next/server";

// Public routes (anyone can access)
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/projects",
  "/contact",
  "/github",
  "/articles",
];

// Regex to match public routes and any sub-paths
const publicPathnameRegex = new RegExp(
  `^(${PUBLIC_ROUTES.map((p) => p.replace(/\//g, "\\/")).join("|")})(/.*)?$`,
  "i",
);

// Example: /doctor/123 or /hospital/45 are public
const publicProfileRegex = /^\/(projects|articles)\/\d+(\/.*)?$/i;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Strip locale prefix (en, bn, ar)
  const pathnameWithoutLocale = pathname.replace(/^\/(en|bn|ar)/, "") || "/";
  const token = req.cookies.get("accessToken")?.value;

  const isPublicPage =
    publicPathnameRegex.test(pathnameWithoutLocale) ||
    publicProfileRegex.test(pathnameWithoutLocale);

  // 🔐 Protect private routes
  if (!isPublicPage && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Everything else is allowed
  return NextResponse.next();
}

// Proxy configuration: match all pages except static files, API, and _next
export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
