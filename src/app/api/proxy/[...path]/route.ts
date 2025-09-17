import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = 'https://api.snapiter.com'

async function makeProxyRequest(
  path: string,
  method: string,
  body?: string,
  accessToken?: string,
  additionalHeaders?: Record<string, string>
) {
  const url = `${API_BASE_URL}/${path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
  })

  return response
}

async function refreshTokens(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieStore.toString(),
      },
    })

    if (response.ok) {
      // Extract new cookies from response
      const setCookieHeader = response.headers.get('set-cookie')
      return { success: true, setCookieHeader }
    }

    return { success: false }
  } catch (error) {
    console.error('Token refresh failed:', error)
    return { success: false }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const { path: pathArray } = await params
  const path = pathArray.join('/')

  try {
    let response = await makeProxyRequest(path, 'GET', undefined, accessToken)

    // If unauthorized, try to refresh token
    if (response.status === 401 || response.status === 403) {
      const refreshResult = await refreshTokens(cookieStore)

      if (refreshResult.success && refreshResult.setCookieHeader) {
        // Get new access token (this is a simplified approach)
        // In production, you might need to parse the Set-Cookie header
        const newAccessToken = cookieStore.get('access_token')?.value

        // Retry the original request
        response = await makeProxyRequest(path, 'GET', undefined, newAccessToken)

        console.log("response", response)

        // Create response with new cookies
        const data = await response.arrayBuffer()
        const nextResponse = new NextResponse(data, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        })

        // Forward the new cookies
        if (refreshResult.setCookieHeader) {
          nextResponse.headers.set('Set-Cookie', refreshResult.setCookieHeader)
        }

        return nextResponse
      } else {
        // Refresh failed, return unauthorized
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
      }
    }

    const data = await response.arrayBuffer()
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  } catch (error) {
    console.error('Proxy request failed:', error)
    return NextResponse.json({ error: 'Proxy request failed' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const { path: pathArray } = await params
  const path = pathArray.join('/')
  const body = await request.text()

  try {
    let response = await makeProxyRequest(path, 'POST', body, accessToken)

    // If unauthorized, try to refresh token
    if (response.status === 401 || response.status === 403) {
      const refreshResult = await refreshTokens(cookieStore)

      if (refreshResult.success) {
        const newAccessToken = cookieStore.get('access_token')?.value
        response = await makeProxyRequest(path, 'POST', body, newAccessToken)

        const data = await response.text()
        const nextResponse = new NextResponse(data, {
          status: response.status,
          headers: {
            'Content-Type': response.headers.get('Content-Type') || 'application/json',
          },
        })

        if (refreshResult.setCookieHeader) {
          nextResponse.headers.set('Set-Cookie', refreshResult.setCookieHeader)
        }

        return nextResponse
      } else {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
      }
    }

    const data = await response.arrayBuffer()
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  } catch (error) {
    console.error('Proxy request failed:', error)
    return NextResponse.json({ error: 'Proxy request failed' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const { path: pathArray } = await params
  const path = pathArray.join('/')
  const body = await request.text()

  try {
    let response = await makeProxyRequest(path, 'PUT', body, accessToken)

    if (response.status === 401 || response.status === 403) {
      const refreshResult = await refreshTokens(cookieStore)

      if (refreshResult.success) {
        const newAccessToken = cookieStore.get('access_token')?.value
        response = await makeProxyRequest(path, 'PUT', body, newAccessToken)

        const data = await response.text()
        const nextResponse = new NextResponse(data, {
          status: response.status,
          headers: {
            'Content-Type': response.headers.get('Content-Type') || 'application/json',
          },
        })

        if (refreshResult.setCookieHeader) {
          nextResponse.headers.set('Set-Cookie', refreshResult.setCookieHeader)
        }

        return nextResponse
      } else {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
      }
    }

    const data = await response.arrayBuffer()
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  } catch (error) {
    console.error('Proxy request failed:', error)
    return NextResponse.json({ error: 'Proxy request failed' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const { path: pathArray } = await params
  const path = pathArray.join('/')

  try {
    let response = await makeProxyRequest(path, 'DELETE', undefined, accessToken)

    if (response.status === 401 || response.status === 403) {
      const refreshResult = await refreshTokens(cookieStore)

      if (refreshResult.success) {
        const newAccessToken = cookieStore.get('access_token')?.value
        response = await makeProxyRequest(path, 'DELETE', undefined, newAccessToken)

        const data = await response.text()
        const nextResponse = new NextResponse(data, {
          status: response.status,
          headers: {
            'Content-Type': response.headers.get('Content-Type') || 'application/json',
          },
        })

        if (refreshResult.setCookieHeader) {
          nextResponse.headers.set('Set-Cookie', refreshResult.setCookieHeader)
        }

        return nextResponse
      } else {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
      }
    }

    const data = await response.arrayBuffer()
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  } catch (error) {
    console.error('Proxy request failed:', error)
    return NextResponse.json({ error: 'Proxy request failed' }, { status: 500 })
  }
}