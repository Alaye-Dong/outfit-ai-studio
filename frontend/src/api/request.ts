const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

interface RequestOptions extends Omit<RequestInit, 'body'> {
  data?: unknown
  params?: Record<string, string | number | boolean | undefined>
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { data, params, method = 'GET', ...rest } = options

  let fullUrl = `${BASE_URL}${url}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, String(value))
    })
    const qs = searchParams.toString()
    if (qs) fullUrl += `?${qs}`
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...rest,
  }

  if (data && method !== 'GET') {
    fetchOptions.body = JSON.stringify(data)
  }

  const response = await fetch(fullUrl, fetchOptions)

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorBody}`)
  }

  const result = await response.json()

  if (result.code !== 0) {
    throw new Error(result.message || '请求失败')
  }

  return result.data as T
}

export function get<T>(url: string, params?: Record<string, string | number | boolean | undefined>) {
  return request<T>(url, { method: 'GET', params })
}

export function post<T>(url: string, data?: unknown) {
  return request<T>(url, { method: 'POST', data })
}

export function put<T>(url: string, data?: unknown) {
  return request<T>(url, { method: 'PUT', data })
}

export function del<T>(url: string) {
  return request<T>(url, { method: 'DELETE' })
}
