import { NextRequest, NextResponse } from "next/server";
import { config } from "@/config";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    console.warn("[consume] Missing token in query params");
    return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
  }

  console.log("[consume] Calling backend /consume with token:", token);

  const res = await fetch(`${config.apiUrl}/api/auth/login/email/consume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });

  console.log("[consume] Backend responded with status:", res.status);

  if (!res.ok) {
    const code = res.status === 400 ? "invalid_or_expired" : "auth_failed";
    console.error("[consume] Backend error, code:", code);
    return NextResponse.json({ ok: false, error: code }, { status: 400 });
  }

  // 🔹 Log raw headers from backend
  console.log("[consume] Backend response headers:");
  res.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });

  const { accessToken } = await res.json();
  console.log("[consume] Access token received:", accessToken.substring(0, 20) + "...");

  const resp = NextResponse.json({ ok: true });

  const rawSetCookies: string[] = []
  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      rawSetCookies.push(value)
    }
  })
  
  console.log("[consume] Raw Set-Cookie headers from backend:", rawSetCookies)
  
  for (let cookie of rawSetCookies) {
    if (process.env.NODE_ENV !== "production") {
      cookie = cookie.replace(/;\s*Secure/gi, "")
      cookie = cookie.replace(/SameSite=Lax/gi, "SameSite=None")
    }
  
    console.log("[consume] Forwarding cookie to browser:", cookie)
    resp.headers.append("set-cookie", cookie)
  }
  

  

  // ✅ Also set our own access_token cookie
  resp.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  console.log("[consume] Added access_token cookie for browser");

  return resp;
}

