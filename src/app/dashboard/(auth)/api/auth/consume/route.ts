import { NextRequest, NextResponse } from "next/server";
import { config } from "@/config";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
  }

  const res = await fetch(`${config.apiUrl}/api/auth/login/email/consume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });


  if (!res.ok) {
    const code = res.status === 400 ? "invalid_or_expired" : "auth_failed";
    return NextResponse.json({ ok: false, error: code }, { status: 400 });
  }

  const { accessToken } = await res.json();

  // collect Set-Cookie headers from backend
  const rawSetCookies: string[] = [];
  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") rawSetCookies.push(value);
  });

  // Build headers manually
  const headers = new Headers();
  headers.set("content-type", "application/json");

  for (let cookie of rawSetCookies) {
    if (process.env.NODE_ENV !== "production") {
      cookie = cookie.replace(/;\s*Secure/gi, "");
      cookie = cookie.replace(/SameSite=Lax/gi, "SameSite=None");
    }
    headers.append("set-cookie", cookie);
  }

  // Also set our own access_token cookie
  const accessCookie = [
    `access_token=${accessToken}`,
    "Path=/",
    "HttpOnly",
    `Max-Age=${60 * 60 * 24 * 7}`,
    process.env.NODE_ENV === "production" ? "Secure; SameSite=Lax" : "SameSite=None",
  ].join("; ");

  headers.append("set-cookie", accessCookie);

  const body = JSON.stringify({ ok: true });
  const response = new NextResponse(body, { status: 200, headers });

  response.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });

  return response;
}
