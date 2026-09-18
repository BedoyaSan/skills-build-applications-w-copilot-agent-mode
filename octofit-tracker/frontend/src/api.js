const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : ''

export async function fetchCollection(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}/`, options)
  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with status ${response.status}`)
  }

  if (!payload) {
    throw new Error('The API returned HTML instead of JSON. Define VITE_CODESPACE_NAME or start the backend on port 8000.')
  }

  return {
    items: Array.isArray(payload)
      ? payload
      : payload.data || payload.items || payload.results || [],
    pagination: payload.pagination || null,
  }
}

export function formatDate(value) {
  if (!value) return 'No date'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value))
}
