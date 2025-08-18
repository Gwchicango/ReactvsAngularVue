// Servicio de autenticación (simulada) usando randomuser.me
import { User } from '../models/User'

// Obtiene un usuario candidato aleatorio
export async function fetchRandomUserCandidate() {
  const res = await fetch('https://randomuser.me/api/')
  if (!res.ok) throw new Error('No se pudo obtener usuario')
  const data = await res.json()
  const rawUser = data.results?.[0]
  return new User(rawUser)
}

// Autentica de forma simulada validando username y contraseña simple.
// Reglas mock: username debe coincidir con el candidato y password longitud >=4
export async function authenticate(username, password, candidateUser) {
  await new Promise(r => setTimeout(r, 400)) // simular latencia
  if (!candidateUser) throw new Error('No hay usuario candidato seleccionado')
  if (username !== candidateUser.username) throw new Error('Usuario incorrecto')
  if (!password || password.length < 4) throw new Error('Password inválido (>=4)')
  // Retornamos el usuario autenticado (en un caso real llegarían tokens)
  return candidateUser
}
