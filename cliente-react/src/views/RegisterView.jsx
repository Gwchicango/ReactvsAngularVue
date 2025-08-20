import { useState } from 'react'
import { registerUser } from '../controllers/authController'
import './auth.css'
import { PiUserPlusBold, PiLockKeyBold, PiUserBold, PiEyeBold, PiEyeSlashBold, PiShieldCheckBold } from 'react-icons/pi'

export function RegisterView({ onSuccess, large }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPw, setShowPw] = useState(false)

  const usernameValid = /^[a-zA-Z0-9]+$/.test(username)
  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
  const passwordValid = password.length >= 4
  const canSubmit = username && email && password && usernameValid && emailValid && passwordValid

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!usernameValid) {
      setError('El usuario solo puede contener letras y números.')
      return
    }
    if (!emailValid) {
      setError('El correo no es válido.')
      return
    }
    if (!passwordValid) {
      setError('La contraseña debe tener al menos 4 caracteres.')
      return
    }
    setLoading(true)
    try {
      const user = await registerUser(username, email, password)
      onSuccess(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`card auth-panel ${large ? 'card-lg':''}`} aria-labelledby="register-heading">
      <h3 id="register-heading" className="auth-title"><PiUserPlusBold /> Registro</h3>
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
          Email
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo electrónico" disabled={loading} />
          {email && !emailValid && <div className="tip" style={{color:'var(--color-danger)'}}>Correo no válido.</div>}
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
            />
            <button type="button" className="btn" style={{padding:'.4rem .55rem'}} onClick={()=>setShowPw(s=>!s)} aria-label={showPw ? 'Ocultar password':'Mostrar password'}>
              {showPw ? <PiEyeSlashBold /> : <PiEyeBold />}
            </button>
          </div>
          {password && !passwordValid && <div className="tip" style={{color:'var(--color-danger)'}}>Mínimo 4 caracteres.</div>}
        </label>
        <div className="inline gap-md">
          <button className="btn btn-primary" type="submit" disabled={!canSubmit || loading}>
            {loading ? <span className="inline"><span className="loader" /> Registrando...</span> : 'Registrar'}
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
