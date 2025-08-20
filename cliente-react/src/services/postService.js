// Servicio de acceso a datos para Posts
// Encapsula llamadas HTTP a una API pública.
import { Post } from '../models/Post'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

// Obtiene posts. Si se pasa un límite, lo aplica; si no, trae todos (JSONPlaceholder devuelve 100)
export async function fetchPosts(limit) {
  const url = typeof limit === 'number' ? `${BASE_URL}/posts?_limit=${limit}` : `${BASE_URL}/posts`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Error obteniendo posts')
  const data = await res.json()
  return data.map(d => new Post(d))
}

export async function searchPostsByTitle(term, limit) {
  const q = encodeURIComponent(term)
  const url = typeof limit === 'number' ? `${BASE_URL}/posts?title_like=${q}&_limit=${limit}` : `${BASE_URL}/posts?title_like=${q}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Error buscando posts')
  const data = await res.json()
  return data.map(d => new Post(d))
}

export async function fetchPost(id) {
  const res = await fetch(`${BASE_URL}/posts/${id}`)
  if (!res.ok) throw new Error('Post no encontrado')
  return new Post(await res.json())
}

export async function fetchPostsByUser(userId) {
  const res = await fetch(`${BASE_URL}/posts?userId=${userId}`)
  if (!res.ok) throw new Error('Error filtrando posts')
  const data = await res.json()
  return data.map(d => new Post(d))
}

export async function createPost({ title, body, userId }) {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ title, body, userId })
  })
  if (!res.ok) throw new Error('Error creando post')
  return new Post(await res.json())
}

export async function updatePost({ id, title, body, userId }) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ id, title, body, userId })
  })
  if (!res.ok) throw new Error('Error actualizando post')
  return new Post(await res.json())
}

export async function patchPost(id, partial) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(partial)
  })
  if (!res.ok) throw new Error('Error aplicando patch')
  return new Post(await res.json())
}

export async function deletePost(id) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error eliminando post')
  return true // JSONPlaceholder finge el delete
}
