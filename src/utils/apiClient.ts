class ApiClient {
  private baseUrl = '/api/proxy'; // Use our proxy instead of direct API calls

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Remove leading slash if present since proxy handles the full path
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint

    const config: RequestInit = {
      ...options,
      credentials: 'include', // Include cookies for server-side handling
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    const response = await fetch(`${this.baseUrl}/${cleanEndpoint}`, config)

    if (!response.ok) {
      // If authentication failed, redirect to login
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard/auth'
        }
      }

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