const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : '/api'

export async function fetchCollection(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/`, options)
  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.error || `Request failed with status ${response.status}`)
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
