import { useState } from 'react'
import { getCandidateUser } from '../controllers/authController'
import './auth.css'
import { PiUserPlusBold, PiCopySimpleBold, PiCheckBold } from 'react-icons/pi'
// (eliminated secondary alias import)

export function UserGeneratorView({ onCandidate, large }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [candidate, setCandidate] = useState(null)
  const [copiedUser, setCopiedUser] = useState(false)
  const [copiedPass, setCopiedPass] = useState(false)

  const handleGenerate = async () => {
    setLoading(true); setError(null)
    try {
      const user = await getCandidateUser()
      setCandidate(user)
      onCandidate(user)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className={`card auth-panel ${large ? 'card-lg':''}`}>
      <h3 className="auth-title"><PiUserPlusBold /> 1. Obtener Usuario</h3>
      <p className="auth-sub">RandomUser API</p>
      <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
        {loading ? <span className="inline"><span className="loader" /> Generando...</span> : 'Generar Usuario'}
      </button>
      {error && <p className="text-danger" style={{color:'var(--color-danger)'}}>{error}</p>}
      {candidate && (
        <div className="candidate-box">
          {candidate.picture && <img src={candidate.picture} width={56} height={56} alt={candidate.name} />}
          <div>
            <div style={{fontWeight:'600'}}>{candidate.name}</div>
            <div className="inline mt-sm" style={{flexWrap:'wrap', gap:'.4rem'}}>
              <div className="status-box" style={{fontSize:'.6rem'}}>
                <strong style={{letterSpacing:'.5px'}}>USER</strong> {candidate.username}
                <button
                  type="button"
                  className="btn ghost-btn"
                  style={{fontSize:'.6rem', padding:'.25rem .45rem'}}
                  onClick={() => {
                    navigator.clipboard.writeText(candidate.username)
                    setCopiedUser(true)
                    setTimeout(()=>setCopiedUser(false), 1400)
                  }}
                >
                  {copiedUser ? <PiCheckBold /> : <PiCopySimpleBold />}
                </button>
              </div>
              <div className="status-box" style={{fontSize:'.6rem'}}>
                <strong style={{letterSpacing:'.5px'}}>PASS</strong> {candidate.password}
                <button
                  type="button"
                  className="btn ghost-btn"
                  style={{fontSize:'.6rem', padding:'.25rem .45rem'}}
                  onClick={() => {
                    navigator.clipboard.writeText(candidate.password)
                    setCopiedPass(true)
                    setTimeout(()=>setCopiedPass(false), 1400)
                  }}
                >
                  {copiedPass ? <PiCheckBold /> : <PiCopySimpleBold />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
