// Controlador de autenticación
import { fetchRandomUserCandidate, authenticate } from '../services/authService'

export async function getCandidateUser() {
  return await fetchRandomUserCandidate()
}

export async function loginWithCredentials(username, password, candidate) {
  return await authenticate(username, password, candidate)
}

export function logoutUser() {
  return true
}
