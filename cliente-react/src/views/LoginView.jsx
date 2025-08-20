import { useState, useMemo } from 'react'
import { loginWithCredentials } from '../controllers/authController'
import './auth.css'
import { PiSignInBold, PiLockKeyBold, PiUserBold, PiEyeBold, PiEyeSlashBold, PiShieldCheckBold } from 'react-icons/pi'

export function LoginView({ onSuccess, large }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPw, setShowPw] = useState(false)

  // Validation regex
  const usernameValid = useMemo(() => /^[a-zA-Z0-9]+$/.test(username), [username])
  const canSubmit = username && password && usernameValid

  const disabled = !canSubmit || loading

  // Simple password strength evaluation
  const pwStrength = (() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 4) score++
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return Math.min(score, 5)
  })()
  const strengthLabels = ['Vacía','Básica','Mejor','Fuerte','Muy Fuerte','Excelente']
  const strengthColors = ['#64748b','#f59e0b','#f59e0b','#10b981','#0ea5e9','#6366f1']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!usernameValid) {
      setError('El usuario solo puede contener letras y números.')
      return
    }
    setLoading(true)
    try {
      const backendUser = await loginWithCredentials(username, password)
      onSuccess(backendUser)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className={`card auth-panel ${large ? 'card-lg':''}`} aria-labelledby="login-heading">
  <h3 id="login-heading" className="auth-title"><PiSignInBold /> Login</h3>
  <p className="text-muted" style={{fontSize:'.7rem', marginTop:'-0.35rem'}}>Ingresa tus credenciales para acceder.</p>
      <form onSubmit={handleSubmit} className="form-stack">
        <label>
          Username
          <div className="inline" style={{alignItems:'stretch'}}>
            <span className="btn" style={{padding:'.4rem .55rem', pointerEvents:'none'}}><PiUserBold /></span>
            <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Usuario" disabled={loading} />
          </div>
          {username && !usernameValid && <div className="tip" style={{color:'var(--color-danger)'}}>Solo letras y números.</div>}
        </label>
        <label>
          Password (&gt;=4)
          <div className="inline" style={{alignItems:'stretch'}}>
            <span className="btn" style={{padding:'.4rem .55rem', pointerEvents:'none'}}><PiLockKeyBold /></span>
            <input
              type={showPw ? 'text':'password'}
              value={password}
              onChange={e=>setPassword(e.target.value)}
              disabled={loading}
              aria-describedby="pw-help pw-strength"
            />
            <button type="button" className="btn" style={{padding:'.4rem .55rem'}} onClick={()=>setShowPw(s=>!s)} aria-label={showPw ? 'Ocultar password':'Mostrar password'}>
              {showPw ? <PiEyeSlashBold /> : <PiEyeBold />}
            </button>
          </div>
          {/* Password suggestion removed: no candidate */}
          {password && (
            <div style={{marginTop:'.4rem'}} id="pw-strength" aria-live="polite">
              <div style={{display:'flex', alignItems:'center', gap:'.5rem'}}>
                <div style={{flex:1, display:'flex', gap:'.25rem'}}>
                  {Array.from({length:5}).map((_,i)=>(
                    <span key={i} style={{flex:1, height:'6px', borderRadius:'2px', background: i < pwStrength ? strengthColors[pwStrength] : 'var(--color-border)'}} />
                  ))}
                </div>
                <span style={{fontSize:'.6rem', fontWeight:600, letterSpacing:'.5px', color:strengthColors[pwStrength]}}>{strengthLabels[pwStrength]}</span>
              </div>
            </div>
          )}
        </label>
        <div className="inline gap-md">
          <button className="btn btn-primary" type="submit" disabled={disabled}>
            {loading ? <span className="inline"><span className="loader" /> Autenticando...</span> : 'Entrar'}
          </button>
        </div>
        {error && <p role="alert" style={{color:'var(--color-danger)', margin:0}}>{error}</p>}
        {!error && canSubmit && !loading && (
          <p className="text-muted" style={{fontSize:'.6rem', display:'flex', alignItems:'center', gap:'.35rem'}}><PiShieldCheckBold /> Listo para enviar.</p>
        )}
      </form>
    </div>
  )
}
