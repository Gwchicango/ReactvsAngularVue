// Controlador: coordina entre servicio (modelo) y la vista (componentes React)
import { fetchPosts, fetchPost, createPost, updatePost, patchPost, deletePost, fetchPostsByUser, searchPostsByTitle } from '../services/postService'

export async function getInitialPosts() {
  // Aquí podríamos añadir cache, validaciones, logging, etc.
  return await fetchPosts()
}

export async function getPost(id) {
  return await fetchPost(id)
}

export async function getPostsByUser(userId) {
  return await fetchPostsByUser(userId)
}

export async function addPost(data) {
  // Validación mínima
  if (!data.title || !data.body) throw new Error('Título y cuerpo requeridos')
  return await createPost(data)
}

export async function putPost(data) {
  if (!data.id) throw new Error('ID requerido')
  return await updatePost(data)
}

export async function partialUpdatePost(id, partial) {
  return await patchPost(id, partial)
}

export async function removePost(id) {
  return await deletePost(id)
}

export async function searchPosts(term) {
  if (!term) return []
  return await searchPostsByTitle(term)
}
