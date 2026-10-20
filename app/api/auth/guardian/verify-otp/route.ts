import { NextResponse } from "next/server";

const BACKEND_URL = (process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000").replace(/\/$/, "");
const COOKIE_NAME = "accessToken";

export async function POST(request: Request) {
  try {
    const upstream = await fetch(`${BACKEND_URL}/api/auth/guardian/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });
    const payload = await upstream.json().catch(() => ({})) as {
      message?: string;
      accessToken?: string;
      guardian?: unknown;
    };

    if (!upstream.ok) return NextResponse.json(payload, { status: upstream.status });
    if (!payload.accessToken) {
      return NextResponse.json({ message: "Authentication response did not include a token" }, { status: 502 });
    }

    const response = NextResponse.json({
      message: payload.message ?? "Login successful",
      guardian: payload.guardian,
      authenticated: true,
    });
    response.cookies.set(COOKIE_NAME, payload.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.JWT_EXPIRES_IN_SECONDS) || 60 * 60,
    });
    return response;
  } catch {
    return NextResponse.json({ message: "Authentication service is unavailable" }, { status: 502 });
  }
}
