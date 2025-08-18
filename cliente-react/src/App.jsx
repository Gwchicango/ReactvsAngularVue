import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { PostsView } from './views/PostsView'
import { LoginView } from './views/LoginView'
import { UserGeneratorView } from './views/UserGeneratorView'
import { HomeView } from './views/HomeView'
import { useAuth } from './context/AuthContext'

function Protected({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function AuthPage() {
  const { candidate, setCandidate, login } = useAuth()
  const navigate = useNavigate()

  const handleSuccess = (user) => {
    login(user)
    navigate('/Home', { replace: true })
  }

  return (
    <div className="auth-viewport">
      <div className="auth-shell">
        <UserGeneratorView onCandidate={setCandidate} large />
        <LoginView candidate={candidate} onSuccess={handleSuccess} large />
      </div>
    </div>
  )
}

function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/auth', { replace: true }) }
  return (
    <>
      <header className="app-header">
        <div className="app-header-inner container flex justify-between items-center gap-md">
          <nav className="nav flex gap-md items-center">
            <Link to="/Home" className="brand">Home</Link>
            <Link to="/posts">Registro</Link>
          </nav>
          <div className="flex items-center gap-md" style={{fontSize:'.75rem'}}>
            {user?.picture && <img src={user.picture} width={34} height={34} style={{borderRadius:'50%'}} alt={user.name} />}
            <span>{user?.name}</span>
            <button className="btn" onClick={handleLogout}>Salir</button>
          </div>
        </div>
      </header>
      <main className="container">{children}</main>
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
      <Route path="/posts" element={<Protected><Layout><PostsView /></Layout></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
