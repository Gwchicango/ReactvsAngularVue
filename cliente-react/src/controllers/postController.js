// Controlador: coordina entre servicio (modelo) y la vista (componentes React)

import {
  fetchBackendPosts,
  createBackendPost,
  updateBackendPost,
  patchBackendPost,
  deleteBackendPost,
  fetchBackendPostsByUser,
  fetchApiPosts,
  createApiPost,
  updateApiPost,
  patchApiPost,
  deleteApiPost,
  fetchApiPostsByUser,
  searchApiPostsByTitle
} from '../services/postService'

// Devuelve todos los posts de ambos orígenes
export async function getInitialPosts() {
  const [backend, api] = await Promise.all([
    fetchBackendPosts(),
    fetchApiPosts()
  ])
  return [...backend, ...api]
}

export async function getPostsByUser(userId) {
  const [backend, api] = await Promise.all([
    fetchBackendPostsByUser(Number(userId)),
    fetchApiPostsByUser(Number(userId))
  ])
  return [...backend, ...api]
}

export async function addPost(data) {
  // Si data.raw, es del API externa, si no, del backend
  if (data.raw) {
    return await createApiPost(data)
  } else {
    return await createBackendPost(data)
  }
}


// Actualiza un post del API externo
export async function putApiPost(data) {
  return await updateApiPost(data)
}

// Actualiza un post del backend
export async function putBackendPost(data) {
  return await updateBackendPost(data)
}

export async function partialUpdatePost(id, partial) {
  // Se asume que partial.raw indica el origen
  if (partial.raw) {
    return await patchApiPost(id, partial)
  } else {
    return await patchBackendPost(id, partial)
  }
}

export async function removePost(id, isApi) {
  // isApi: true si es del API externa
  if (isApi) {
    return await deleteApiPost(id)
  } else {
    return await deleteBackendPost(id)
  }
}

export async function searchPosts(term) {
  if (!term) return []
  const [backend, api] = await Promise.all([
    fetchBackendPosts(),
    searchApiPostsByTitle(term)
  ])
  // Filtrar backend por título
  const filteredBackend = backend.filter(p => p.title && p.title.toLowerCase().includes(term.toLowerCase()))
  return [...filteredBackend, ...api]
}


