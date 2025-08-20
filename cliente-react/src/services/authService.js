
import { User } from '../models/User'

const BASE_URL = 'http://localhost:3000'

// Obtiene un usuario candidato aleatorio y lo registra en la BD
export async function fetchRandomUserCandidate() {
  const res = await fetch('https://randomuser.me/api/')
  if (!res.ok) throw new Error('No se pudo obtener usuario')
  const data = await res.json()
  const rawUser = data.results?.[0]
  const user = new User(rawUser)
  // Registrar en backend
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: user.username,
      password: user.password,
      email: user.email
    })
  })
  if (!regRes.ok) {
    const err = await regRes.json().catch(()=>({error:'Error'}))
    throw new Error(err.error || 'Error registrando usuario en backend')
  }
  const dbUser = await regRes.json()
  // Devuelve el user enriquecido con id real
  return { ...user, id: dbUser.id, dbUser }
}

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
