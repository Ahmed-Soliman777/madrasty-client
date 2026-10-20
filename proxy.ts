import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const BACKEND_URL = (process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000").replace(/\/$/, "");
const LOCALES = new Set<string>(routing.locales);

type SessionUser = {
  type: "guardian" | "staff";
  role: string;
};

async function getSessionUser(token: string): Promise<SessionUser | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = await response.json() as { user?: SessionUser };
    return payload.user ?? null;
  } catch {
    return null;
  }
}

function clearSession(response: NextResponse) {
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const locale = segments[0] && LOCALES.has(segments[0]) ? segments[0] : routing.defaultLocale;
  const routeSegments = segments[0] && LOCALES.has(segments[0]) ? segments.slice(1) : segments;
  const route = routeSegments.join("/");
  const isLoginPage = route === "";
  const isParentPage = route === "home" || route.startsWith("home/");
  const isStaffPage = route === "staff" || route.startsWith("staff/");
  const token = request.cookies.get("accessToken")?.value;

  if (token && (isLoginPage || isParentPage || isStaffPage)) {
    const user = await getSessionUser(token);
    if (!user) {
      if (isParentPage || isStaffPage) {
        const response = NextResponse.redirect(new URL(`/${locale}`, request.url));
        clearSession(response);
        return response;
      }
      const response = intlMiddleware(request);
      clearSession(response);
      return response;
    }

    if (isLoginPage) {
      if (user.type === "guardian") {
        return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
      }
      if (user.type === "staff" && (user.role === "TEACHER" || user.role === "SCHOOL_ADMIN")) {
        return NextResponse.redirect(new URL(`/${locale}/staff`, request.url));
      }
    }

    if (isParentPage && user.type !== "guardian") {
      return NextResponse.redirect(new URL(`/${locale}/staff`, request.url));
    }

    if (isStaffPage && (user.type !== "staff" || !["TEACHER", "SCHOOL_ADMIN"].includes(user.role))) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  if ((isParentPage || isStaffPage) && !token) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
