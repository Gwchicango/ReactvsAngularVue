import { Routes, Route, Navigate, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { RoomsView } from './views/RoomsView'
import { GuestsView } from './views/GuestsView'
import { ReservationsView } from './views/ReservationsView'
import { LoginView } from './views/LoginView'
import { RegisterView } from './views/RegisterView'
import { HomeView } from './views/HomeView'
import { useAuth } from './context/AuthContext'

function Protected({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function AuthPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showRegister, setShowRegister] = useState(false)

  const handleSuccess = (user) => {
    login(user)
    navigate('/Home', { replace: true })
  }

  return (
    <div className="auth-viewport">
      <div className="auth-shell">
        {showRegister ? (
          <div style={{position:'relative'}}>
            <RegisterView onSuccess={handleSuccess} large />
            <div style={{display:'flex', justifyContent:'center'}}>
              <button className="btn ghost-btn" style={{marginTop:'1rem'}} onClick={()=>setShowRegister(false)}>¿Ya tienes cuenta? Inicia sesión</button>
            </div>
          </div>
        ) : (
          <div style={{position:'relative'}}>
            <LoginView onSuccess={handleSuccess} large />
            <div style={{display:'flex', justifyContent:'center'}}>
              <button className="btn ghost-btn" style={{marginTop:'1rem'}} onClick={()=>setShowRegister(true)}>¿No tienes cuenta? Regístrate</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isPosts = location.pathname.startsWith('/posts')
  const handleLogout = () => { logout(); navigate('/auth', { replace: true }) }
  return (
    <>
      <header className="app-header">
        <div className="app-header-inner container flex justify-between items-center gap-md">
          <nav className="nav flex gap-md items-center">
            <NavLink to="/Home" className={({isActive})=>`brand ${isActive? 'btn-nav active':''}`}>HOME</NavLink>
            <NavLink to="/rooms" className={({isActive})=>`${isActive? 'btn-nav active':''}`}>HABITACIONES</NavLink>
            <NavLink to="/guests" className={({isActive})=>`${isActive? 'btn-nav active':''}`}>HUÉSPEDES</NavLink>
            <NavLink to="/reservations" className={({isActive})=>`${isActive? 'btn-nav active':''}`}>RESERVAS</NavLink>
          </nav>
          <div className="flex items-center gap-md" style={{fontSize:'.75rem'}}>
            {user?.picture && <img src={user.picture} width={34} height={34} style={{borderRadius:'50%'}} alt={user.name} />}
            <span>{user?.name}</span>
            <button className="btn" onClick={handleLogout}>Salir</button>
          </div>
        </div>
      </header>
  <main className={isPosts ? 'posts-full' : 'container'}>{children}</main>
    </>
  ) 
}

export default function App() {
  return (
    <Routes>
  <Route path="/auth" element={<AuthPage />} />
  <Route path="/Home" element={<Protected><Layout><HomeView /></Layout></Protected>} />
  <Route path="/home" element={<Navigate to="/Home" replace />} />
  <Route path="/" element={<Navigate to="/Home" replace />} />
      <Route path="/rooms" element={<Protected><Layout><RoomsView /></Layout></Protected>} />
      <Route path="/guests" element={<Protected><Layout><GuestsView /></Layout></Protected>} />
      <Route path="/reservations" element={<Protected><Layout><ReservationsView /></Layout></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
