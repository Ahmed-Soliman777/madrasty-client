import { NextResponse } from "next/server";

const BACKEND_URL = (process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000").replace(/\/$/, "");

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const upstream = await fetch(`${BACKEND_URL}/api/auth/guardian/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      cache: "no-store",
    });
    const payload = await upstream.text();
    return new Response(payload, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "Authentication service is unavailable" }, { status: 502 });
  }
}
