import { Post } from '../models/Post'

const API_URL = import.meta.env.VITE_API_URL_POST
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// --- MÉTODOS FALTANTES PARA API EXTERNA ---
export async function updateApiPost({ id, title, body, userId }) {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ id, title, body, userId })
  })
  if (!res.ok) throw new Error('Error actualizando post en API')
  const d = await res.json()
  return new Post({ ...d, raw: d })
}

export async function patchApiPost(id, partial) {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(partial)
  })
  if (!res.ok) throw new Error('Error aplicando patch en API')
  const d = await res.json()
  return new Post({ ...d, raw: d })
}

export async function deleteApiPost(id) {
  const res = await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error eliminando post en API')
  return true // JSONPlaceholder finge el delete
}




// --- POSTS DEL BACKEND ---
export async function fetchBackendPosts() {
  const res = await fetch(`${BACKEND_URL}/posts`)
  if (!res.ok) throw new Error('Error obteniendo posts del backend')
  const data = await res.json()
  return data.map(d => new Post(d))
}

export async function createBackendPost({ title, body, userId }) {
  const res = await fetch(`${BACKEND_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, userId })
  })
  if (!res.ok) throw new Error('Error creando post en backend')
  return new Post(await res.json())
}

export async function updateBackendPost({ id, title, body, userId }) {
  const res = await fetch(`${BACKEND_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, title, body, userId })
  })
  if (!res.ok) throw new Error('Error actualizando post en backend')
  return new Post(await res.json())
}

export async function patchBackendPost(id, partial) {
  const res = await fetch(`${BACKEND_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partial)
  })
  if (!res.ok) throw new Error('Error aplicando patch en backend')
  return new Post(await res.json())
}

export async function deleteBackendPost(id) {
  const res = await fetch(`${BACKEND_URL}/posts/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error eliminando post en backend')
  return true
}

export async function fetchBackendPostsByUser(userId) {
  const res = await fetch(`${BACKEND_URL}/posts`)
  if (!res.ok) throw new Error('Error obteniendo posts del backend')
  const data = await res.json()
  return data.filter(d => d.userId === userId).map(d => new Post(d))
}

// --- POSTS DEL API EXTERNA ---
export async function fetchApiPosts(limit) {
  const url = typeof limit === 'number' ? `${API_URL}/posts?_limit=${limit}` : `${API_URL}/posts`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Error obteniendo posts del API')
  const data = await res.json()
  return data.map(d => new Post({ ...d, raw: d }))
}

export async function createApiPost({ title, body, userId }) {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ title, body, userId })
  })
  if (!res.ok) throw new Error('Error creando post en API')
  const d = await res.json()
  return new Post({ ...d, raw: d })
}

export async function searchApiPostsByTitle(term, limit) {
  const q = encodeURIComponent(term)
  const url = typeof limit === 'number'
    ? `${API_URL}/posts?title_like=${q}&_limit=${limit}`
    : `${API_URL}/posts?title_like=${q}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Error buscando posts en API')
  const data = await res.json()
  return data.map(d => new Post({ ...d, raw: d }))
}

export async function fetchApiPostsByUser(userId) {
  const res = await fetch(`${API_URL}/posts?userId=${userId}`)
  if (!res.ok) throw new Error('Error filtrando posts en API')
  const data = await res.json()
  return data.map(d => new Post({ ...d, raw: d }))
}
