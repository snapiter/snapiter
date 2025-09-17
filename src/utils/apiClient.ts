import { config } from "@/config";

class ApiClient {
  private baseUrl = config.apiUrl;
  private isRefreshing = false
  private refreshPromise: Promise<boolean> | null = null

  private async getAccessToken(): Promise<string | null> {
    if (typeof document === 'undefined') return null

    const cookies = document.cookie.split(';')
    const accessTokenCookie = cookies.find(cookie =>
      cookie.trim().startsWith('access_token=')
    )


    return accessTokenCookie ? accessTokenCookie.split('=')[1] : null
  }

  private async refreshToken(): Promise<boolean> {
    // Prevent multiple concurrent refresh attempts
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.performTokenRefresh()

    try {
      const result = await this.refreshPromise
      return result
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  private async performTokenRefresh(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Include cookies (refresh token)
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Token refresh successful - new tokens should be set in cookies
        return true
      } else {
        // Refresh failed - redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard/auth'
        }
        return false
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard/auth'
      }
      return false
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const accessToken = await this.getAccessToken()

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, config)

    // If unauthorized, try to refresh token and retry
    if (response.status === 401 || response.status === 403) {
      const refreshSuccess = await this.refreshToken()

      if (refreshSuccess) {
        // Retry the original request with new token
        const newAccessToken = await this.getAccessToken()
        const retryConfig: RequestInit = {
          ...config,
          headers: {
            ...config.headers,
            ...(newAccessToken && { Authorization: `Bearer ${newAccessToken}` }),
          },
        }

        console.log('Retrying request with new token')
        console.log(retryConfig)

        response = await fetch(`${this.baseUrl}${endpoint}`, retryConfig)
      } else {
        throw new Error('Authentication failed')
      }
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }

    return response.text() as unknown as T
  }

  // Convenience methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Export a singleton instance
export const apiClient = new ApiClient()
export default apiClient