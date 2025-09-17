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

  const resp = NextResponse.json({ ok: true });
  resp.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // adjust as needed
  });

  return resp;
}
