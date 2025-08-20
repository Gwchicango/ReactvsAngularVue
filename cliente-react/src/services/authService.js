


const BASE_URL = import.meta.env.VITE_BACKEND_URL

const API_URL = import.meta.env.VITE_API_URL


// (Eliminado: generación de usuario aleatorio y registro automático)

// Login real contra backend
export async function authenticate(username, password, candidateUser) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:'Error'}))
    throw new Error(err.error || 'Credenciales incorrectas')
  }
  const user = await res.json()
  return user
}
