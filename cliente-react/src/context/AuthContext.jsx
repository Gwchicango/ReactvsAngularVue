import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Guardar toda la data del usuario autenticado, menos la contraseña
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = useCallback(userObj => {
    if (!userObj) {
      setUser(null)
      localStorage.removeItem('auth_user')
      return
    }
    // Excluir password
    const { password, ...userNoPass } = userObj
    setUser(userNoPass)
    localStorage.setItem('auth_user', JSON.stringify(userNoPass))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }, [])

  const value = { user, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
