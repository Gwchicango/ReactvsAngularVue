import { Link } from 'react-router-dom'
import './home.css'
import { useAuth } from '../context/AuthContext'
import { PiNotebookBold, PiUserCircleBold, PiUserBold, PiAtBold, PiIdentificationBadgeBold } from 'react-icons/pi'

export function HomeView() {
  const { user } = useAuth()

  if (!user) return <p className="text-muted">No hay usuario activo.</p>

  return (
    <div className="home-wrapper">
      <header className="dashboard-header">
        <h1 className="h2">Dashboard</h1>
        <p className="dashboard-sub">Bienvenido, <b>{user.username || user.email || user.id}</b>.</p>
        <div className="actions-row">
          <Link to="/posts" className="btn btn-primary"><PiNotebookBold /> Ver Posts</Link>
          <Link to="/auth" className="btn"><PiUserCircleBold /> Cambiar Usuario</Link>
        </div>
      </header>
      <div className="dashboard-layout">
        <div className="stack">
          <div className="card panel">
            <div className="panel-title"><PiIdentificationBadgeBold /> Usuario</div>
            <div style={{fontSize:'.9rem', fontWeight:600, marginTop:'1rem'}}><PiIdentificationBadgeBold style={{marginRight:4}} />ID: {user.id}</div>
            {user.username && <div style={{fontSize:'.9rem', marginTop:'.5rem'}}><PiUserBold style={{marginRight:4}} />Usuario: {user.username}</div>}
            {user.email && <div style={{fontSize:'.9rem', marginTop:'.5rem'}}><PiAtBold style={{marginRight:4}} />Email: {user.email}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
