import { useSetAtom } from "jotai"
import { dashboardLoading, errorMessage } from "@/store/atoms"

export function useDashboardApiClient() {
  const setLoading = useSetAtom(dashboardLoading)
  const setErrorMessage = useSetAtom(errorMessage)

  async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    setLoading(true)
    try {
      const res = await fetch(`/api/proxy${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })
      if (!res.ok) {
        setErrorMessage({ message: res.statusText ?? "Unknown error", status: res.status });
        throw new Error(`${res.statusText ?? "Unknown error"}`)
      }
      const contentType = res.headers.get("content-type")
      if (contentType?.includes("application/json")) return res.json()
      return (res.text() as unknown) as T
    } finally {
      setLoading(false)
    }
  }

  return {
    get<T>(endpoint: string) {
      return request<T>(endpoint, { method: "GET" })
    },
    post<T>(endpoint: string, data?: unknown) {
      return request<T>(endpoint, { method: "POST", body: JSON.stringify(data) })
    },
    put<T>(endpoint: string, data?: unknown) {
      return request<T>(endpoint, { method: "PUT", body: JSON.stringify(data) })
    },
    delete<T>(endpoint: string) {
      return request<T>(endpoint, { method: "DELETE" })
    },
  }
}
