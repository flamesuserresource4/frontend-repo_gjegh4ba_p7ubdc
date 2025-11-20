const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function http(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

export const api = {
  schema: () => http('/schema'),
  list: (collection) => http(`/api/${collection}`),
  get: (collection, id) => http(`/api/${collection}/${id}`),
  create: (collection, data) => http(`/api/${collection}`, { method: 'POST', body: JSON.stringify({ data }) }),
  update: (collection, id, data) => http(`/api/${collection}/${id}`, { method: 'PUT', body: JSON.stringify({ data }) }),
  remove: (collection, id) => http(`/api/${collection}/${id}`, { method: 'DELETE' }),
}

export { BASE_URL }
