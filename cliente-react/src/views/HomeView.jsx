import { Link } from 'react-router-dom'
import './home.css'
import { useAuth } from '../context/AuthContext'
import { PiNotebookBold, PiUserCircleBold, PiCopySimpleBold, PiCheckBold, PiMapPinBold, PiClockBold, PiGlobeHemisphereWestBold, PiShieldCheckBold, PiLockKeyBold, PiUserBold, PiArrowsClockwiseBold, PiSignOutBold } from 'react-icons/pi'
import { useState } from 'react'

export function HomeView() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(null)

  if (!user) return <p className="text-muted">No hay usuario activo.</p>

  const passStrength = (() => {
    const pwd = user.password || ''
    if (!pwd) return 0
    let s = 0
    if (pwd.length >= 4) s++
    if (pwd.length >= 8) s++
    if (/[A-Z]/.test(pwd)) s++
    if (/[0-9]/.test(pwd)) s++
    if (/[^A-Za-z0-9]/.test(pwd)) s++
    return Math.min(s,5)
  })()

  const copy = (label, value) => {
    navigator.clipboard.writeText(value)
    setCopied(label)
    setTimeout(()=>setCopied(null), 1400)
  }

  const loc = user.raw.location

  return (
    <div className="home-wrapper">
      <header className="dashboard-header">
        <h1 className="h2">Dashboard</h1>
        <p className="dashboard-sub">Resumen compacto del usuario activo, credenciales (sólo demo), localización y acciones rápidas.</p>
        <div className="actions-row">
          <Link to="/posts" className="btn btn-primary"><PiNotebookBold /> Ver Posts</Link>
          <Link to="/auth" className="btn"><PiUserCircleBold /> Cambiar Usuario</Link>
        </div>
      </header>

      <div className="dashboard-layout">
        <div className="stack">
          {/* Stats */}
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-label">Nacionalidad</div>
              <div className="stat-value" style={{fontSize:'1.15rem', display:'flex', alignItems:'center', gap:'.4rem'}}><PiGlobeHemisphereWestBold /> {user.raw.nat}</div>
              <div className="stat-trend trend-flat">Dato base</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Zona Horaria</div>
              <div className="stat-value" style={{fontSize:'1.05rem', display:'flex', alignItems:'center', gap:'.4rem'}}><PiClockBold /> {loc.timezone.offset}</div>
              <div className="stat-trend trend-flat">{loc.timezone.description.slice(0,38)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Ubicación</div>
              <div className="stat-value" style={{fontSize:'1rem', display:'flex', alignItems:'center', gap:'.4rem'}}><PiMapPinBold /> {loc.country}</div>
              <div className="stat-trend trend-flat">{loc.city}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Password score</div>
              <div className="stat-value" style={{fontSize:'1.3rem', display:'flex', alignItems:'center', gap:'.4rem'}}><PiLockKeyBold /> {passStrength}/5</div>
              <div className="stat-trend trend-flat">Heurístico</div>
            </div>
          </div>

          {/* User summary */}
          <div className="card panel">
            <div className="panel-title"><PiUserBold /> Usuario</div>
            <div className="user-summary">
              {user.picture && <img src={user.picture} alt={user.name} />}
              <div style={{display:'flex', flexDirection:'column', gap:'.4rem'}}>
                <strong style={{fontSize:'.9rem'}}>{user.name}</strong>
                <span style={{fontSize:'.65rem', color:'var(--color-text-muted)'}}>{user.email}</span>
                <ul className="list-inline" style={{marginTop:'.25rem'}}>
                  <li><PiShieldCheckBold /> <span style={{fontSize:'.6rem'}}>{user.id}</span></li>
                  <li><PiClockBold /> <span style={{fontSize:'.6rem'}}>{loc.timezone.offset} {loc.timezone.description}</span></li>
                </ul>
              </div>
              {/* Línea divisoria visual y datos del API fuera del bloque principal */}
            </div>
            <hr style={{margin:'1.2rem 0', border:'none', borderTop:'2px dashed #cbd5e1'}} />
            <div style={{fontSize:'.7rem', color:'#64748b', marginBottom:'.2rem', fontWeight:600}}>Datos originales del API randomuser.me</div>
            {user.raw && user.raw.login ? (
              <div style={{fontSize:'.65rem', color:'#64748b'}}>
                <div><b>Username API:</b> {user.raw.login.username}</div>
                <div><b>Password API:</b> {user.raw.login.password}</div>
                <div><b>UUID API:</b> {user.raw.login.uuid}</div>
              </div>
            ) : (
              <div style={{fontSize:'.65rem', color:'#64748b'}}>No hay datos de randomuser.me para este usuario.</div>
            )}
          </div>

          {/* Credentials */}
            <div className="card panel">
              <div className="panel-title"><PiLockKeyBold /> Credenciales (Demo)</div>
              <div className="credentials-box">
                <div className="cred-chip">
                  <strong style={{letterSpacing:'.5px'}}>USER</strong> {user.username}
                  <button className="copy-btn" type="button" onClick={()=>copy('user', user.username)}>
                    {copied==='user'? <PiCheckBold /> : <PiCopySimpleBold />}
                  </button>
                </div>
                <div className="cred-chip">
                  <strong style={{letterSpacing:'.5px'}}>PASS</strong> {user.password}
                  <button className="copy-btn" type="button" onClick={()=>copy('pass', user.password)}>
                    {copied==='pass'? <PiCheckBold /> : <PiCopySimpleBold />}
                  </button>
                </div>
              </div>
              <div className="security-meter" style={{marginTop:'.5rem'}}>
                <div className="meter-bars">
                  {Array.from({length:5}).map((_,i)=>(
                    <span key={i} className={i < passStrength ? 'active':''} />
                  ))}
                </div>
                <span style={{fontSize:'.55rem', letterSpacing:'.5px', fontWeight:600}}>Score</span>
              </div>
            </div>
        </div>

        {/* Right column panels */}
        <div className="stack">
          <div className="card panel">
            <div className="panel-title"><PiMapPinBold /> Localización</div>
            <div className="location-box">
              <div style={{display:'flex', gap:'.45rem', alignItems:'center'}}><PiMapPinBold /> {loc.street.number} {loc.street.name}</div>
              <div style={{display:'flex', gap:'.45rem', alignItems:'center'}}><PiMapPinBold /> {loc.city}, {loc.state}</div>
              <div style={{display:'flex', gap:'.45rem', alignItems:'center'}}><PiGlobeHemisphereWestBold /> {loc.country} ({loc.postcode})</div>
              <div style={{display:'flex', gap:'.45rem', alignItems:'center'}}><PiMapPinBold /> Lat: {loc.coordinates.latitude} / Lng: {loc.coordinates.longitude}</div>
              <div style={{display:'flex', gap:'.45rem', alignItems:'center'}}><PiClockBold /> {loc.timezone.offset} {loc.timezone.description}</div>
            </div>
          </div>
          <div className="card panel">
            <div className="panel-title">Acciones Rápidas</div>
            <div className="actions-row">
              <Link to="/posts" className="btn btn-primary"><PiNotebookBold /> Posts</Link>
              <Link to="/auth" className="btn"><PiUserCircleBold /> Nuevo Usuario</Link>
              <Link to="/auth" className="btn"><PiArrowsClockwiseBold /> Regenerar</Link>
            </div>
            <p style={{fontSize:'.6rem', color:'var(--color-text-muted)'}}>La regeneración te llevará a Auth para obtener otro usuario aleatorio.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
