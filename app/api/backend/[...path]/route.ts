import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = (process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000").replace(/\/$/, "");
const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

type RouteContext = { params: Promise<{ path: string[] }> };

async function forward(request: Request, context: RouteContext) {
  try {
    const token = (await cookies()).get("accessToken")?.value;
    if (!token) {
      return NextResponse.json({ code: "AUTH_TOKEN_MISSING", message: "Authentication required" }, { status: 401 });
    }

    const { path } = await context.params;
    const suffix = path.map((part) => encodeURIComponent(part)).join("/");
    const incomingUrl = new URL(request.url);
    const headers = new Headers({ Authorization: `Bearer ${token}` });
    const contentType = request.headers.get("content-type");
    if (contentType) headers.set("Content-Type", contentType);

    const init: RequestInit = {
      method: request.method,
      headers,
      cache: "no-store",
    };
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = await request.text();
    }

    const upstream = await fetch(`${BACKEND_URL}/api/${suffix}${incomingUrl.search}`, init);
    const payload = await upstream.text();
    return new Response(payload, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ code: "BACKEND_UNAVAILABLE", message: "The service is temporarily unavailable" }, { status: 502 });
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
