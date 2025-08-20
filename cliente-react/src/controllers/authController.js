import { authenticate } from '../services/authService'

export async function registerUser(username, email, password) {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:'Error'}))
    throw new Error(err.error || 'Error registrando usuario')
  }
  return await res.json()
}

export async function loginWithCredentials(username, password) {
  return await authenticate(username, password)
}

export function logoutUser() {
  return true
}
