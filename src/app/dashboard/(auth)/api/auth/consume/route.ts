import { type NextRequest, NextResponse } from "next/server";
import { config } from "@/config";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "missing_token" },
      { status: 400 },
    );
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

  // extract refresh_token from backend's set-cookie
  const setCookie = res.headers.get("set-cookie");
  let refreshToken: string | null = null;
  if (setCookie) {
    const match = setCookie.match(/refresh_token=([^;]+)/);
    if (match) {
      refreshToken = match[1];
    }
  }

  const resp = NextResponse.json({ ok: true });

  if (refreshToken) {
    resp.cookies.set({
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  resp.cookies.set({
    name: "access_token",
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return resp;
}
