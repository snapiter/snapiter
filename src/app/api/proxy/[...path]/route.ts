import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import getEnv from "@/utils/env/getEnv";

async function refreshTokens(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  apiBaseUrl: string,
) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
    });

    if (response.ok) {
      const setCookieHeader = response.headers.get("set-cookie");
      const data = await response.json();
      const newAccessToken = data.accessToken;

      return { success: true, setCookieHeader, newAccessToken };
    }
    console.log(
      "Check for refresh token failed, on token: ",
      cookieStore.get("refresh_token")?.value,
    );

    return { success: false };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return { success: false };
  }
}

async function makeProxyRequest(
  path: string,
  method: string,
  apiBaseUrl: string,
  body?: string,
  accessToken?: string,
  additionalHeaders?: Record<string, string>,
) {
  const url = `${apiBaseUrl}/${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  return response;
}
async function proxyWithRefresh(
  path: string,
  method: string,
  apiBaseUrl: string,
  body?: string,
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  let response = await makeProxyRequest(
    path,
    method,
    apiBaseUrl,
    body,
    accessToken,
  );

  // If unauthorized → try refresh
  if (response.status === 401 || response.status === 403) {
    const refreshResult = await refreshTokens(cookieStore, apiBaseUrl);

    if (refreshResult.success && refreshResult.newAccessToken) {
      response = await makeProxyRequest(
        path,
        method,
        apiBaseUrl,
        body,
        refreshResult.newAccessToken,
      );

      const nextResponse = await buildNextResponse(response);

      if (refreshResult.setCookieHeader) {
        nextResponse.headers.set("Set-Cookie", refreshResult.setCookieHeader);
      }

      return nextResponse;
    } else {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 },
      );
    }
  }

  if (!response.ok) {
    console.error(`[Proxy Response Error] ${method} ${path}`, {
      body,
      status: response.status,
      statusText: response.statusText,
    });
  }

  return await buildNextResponse(response);
}

function buildNextResponse(response: Response) {
  if (response.status === 204 || response.status === 304) {
    return new NextResponse(null, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }
  return response.arrayBuffer().then(
    (data) =>
      new NextResponse(data, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      }),
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const env = getEnv();
  const { path: pathArray } = await params;
  const path = pathArray.join("/");
  return proxyWithRefresh(path, "GET", env.SNAPITER_API_URL);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const env = getEnv();
  const { path: pathArray } = await params;
  const path = pathArray.join("/");
  const body = await request.text();
  return proxyWithRefresh(path, "POST", env.SNAPITER_API_URL, body);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const env = getEnv();
  const { path: pathArray } = await params;
  const path = pathArray.join("/");
  const body = await request.text();
  return proxyWithRefresh(path, "PUT", env.SNAPITER_API_URL, body);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const env = getEnv();
  const { path: pathArray } = await params;
  const path = pathArray.join("/");
  return proxyWithRefresh(path, "DELETE", env.SNAPITER_API_URL);
}
