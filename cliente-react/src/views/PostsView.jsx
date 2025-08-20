import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getInitialPosts, addPost, removePost, putBackendPost, putApiPost, partialUpdatePost, getPostsByUser, searchPosts } from '../controllers/postController'
import './posts.css'
import { PiPlusBold, PiTrashBold, PiPencilBold, PiCheckBold, PiXBold, PiArrowsClockwiseBold } from 'react-icons/pi'

export function PostsView() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ title:'', body:'', userId: user?.id || 1 })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title:'', body:'', userId: user?.id || 1 })
  const [filterUser, setFilterUser] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [busyIds, setBusyIds] = useState(new Set())
  const [showOverlay, setShowOverlay] = useState(false)
  const [quickEditId, setQuickEditId] = useState(null)
  const [quickTitle, setQuickTitle] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showDelete, setShowDelete] = useState(null) // id a eliminar

  const load = async () => {
    setLoading(true); setError(null); setShowOverlay(true)
    try {
      let data
      if (debouncedSearch) {
        data = await searchPosts(debouncedSearch)
        if (filterUser) data = data.filter(p => String(p.userId) === String(filterUser))
      } else if (filterUser) {
        data = await getPostsByUser(filterUser)
      } else {
        data = await getInitialPosts()
      }
      setPosts(data)
    } catch (e) {
      setError(e.message)
      console.error('Error en load():', e)
    } finally {
      setLoading(false); setTimeout(()=>setShowOverlay(false), 300)
    }
  }

  useEffect(() => { load() }, [filterUser, debouncedSearch])

  // Debounce búsqueda
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 420)
    return () => clearTimeout(id)
  }, [searchTerm])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      setCreating(true)
      const newPost = await addPost({ ...form, userId: user?.id || 1 })
      setPosts(p => [newPost, ...p])
      setForm({ title:'', body:'', userId: user?.id || 1 })
      setShowCreateModal(false)
    } catch (e) {
      setError(e.message)
    } finally { setCreating(false) }
  }
  // Si cambia el usuario, actualiza el userId del form
  useEffect(() => {
    setForm(f => ({ ...f, userId: user?.id || 1 }))
  }, [user])

  const startEdit = (p) => {
    setEditingId(p.id)
    setEditForm({ title: p.title, body: p.body, userId: p.userId, id: p.id })
  }

  const cancelEdit = () => { setEditingId(null) }

  const submitEdit = async () => {
    try {
      setBusyIds(s => new Set([...s, editingId]))
      if (editForm.raw) {
        await putApiPost(editForm)
      } else {
        await putBackendPost(editForm)
      }
      await load();
      setEditingId(null)
    } catch (e) { setError(e.message) }
    finally { setBusyIds(s => { s.delete(editingId); return new Set(s) }) }
  }

  const patchTitle = (p) => { setQuickEditId(p.id); setQuickTitle(p.title) }

  const submitQuickTitle = async (p) => {
    if (!quickTitle.trim()) return setQuickEditId(null)
    try {
      setBusyIds(s => new Set([...s, p.id]))
      const updated = await partialUpdatePost(p.id, { title: quickTitle.trim() })
      setPosts(list => list.map(x => x.id === p.id ? updated : x))
    } catch (e) { setError(e.message) }
    finally { setBusyIds(s => { s.delete(p.id); return new Set(s) }); setQuickEditId(null) }
  }

  const del = async (id) => {
    try {
      setBusyIds(s => new Set([...s, id]))
      await removePost(id)
      setPosts(list => list.filter(p => p.id !== id))
    } catch (e) { setError(e.message) }
    finally { setBusyIds(s => { s.delete(id); return new Set(s) }); setShowDelete(null) }
  }

  const dismissError = () => setError(null)

  return (
    <div className="posts-wrapper">
      {error && (
        <div className="error-banner fade-in" role="alert">
          <span>{error}</span>
          <button className="btn mini-btn" onClick={dismissError}><PiXBold /></button>
        </div>
      )}
      <div className="posts-toolbar">
        <h2 className="h2" style={{margin:'0 1rem 0 0'}}>Registros</h2>
          <div className="posts-actions">
            <button className="btn" onClick={load} disabled={loading}><PiArrowsClockwiseBold /> Refrescar</button>
            <button className="btn btn-primary" onClick={()=>{ setShowCreateModal(true); setCreating(false) }}><PiPlusBold /> Nuevo</button>
            <div className="filter-box" style={{alignItems:'flex-end'}}>
          <label style={{display:'flex', flexDirection:'column', fontSize:'.55rem'}}>
            <span style={{marginBottom:'.25rem'}}>Filtrar userId</span>
            <input style={{width:'110px'}} placeholder="ej: 1" value={filterUser} onChange={e=>setFilterUser(e.target.value)} />
          </label>
          <label style={{display:'flex', flexDirection:'column', fontSize:'.55rem'}}>
            <span style={{marginBottom:'.25rem'}}>Buscar título</span>
            <input style={{width:'180px'}} placeholder="texto..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
          </label>
          {(filterUser || searchTerm) && <button className="btn mini-btn" onClick={()=>{ setFilterUser(''); setSearchTerm('') }}>Limpiar</button>}
        </div>
          </div>
      </div>

      {loading && (
        <div className="skeleton-grid" aria-hidden="true">
          {Array.from({length:6}).map((_,i)=>(<div key={i} className="skeleton-card" />))}
        </div>
      )}

      {posts.length === 0 && !loading && <p className="empty">Sin resultados.</p>}

      {/* Lista de posts del backend (sin raw) */}
      <h3 style={{
        margin:'1.8rem 0 .7rem',
        color:'#fff',
        fontWeight:800,
        fontSize:'1.35rem',
        background:'linear-gradient(90deg,#334155 80%,#475569 100%)',
        padding:'10px 22px',
        borderRadius:'10px',
        boxShadow:'0 2px 12px #33415522',
        letterSpacing:'.5px',
        display:'flex',
        alignItems:'center',
        gap:'10px',
        textShadow:'0 2px 8px #0002'
      }}>
        <span style={{fontSize:'1.5em',opacity:.85,verticalAlign:'middle'}}>🏠</span>
        Registros de Servicio local
      </h3>
      <ul className="posts-list">
        {(() => {
          // Filtrar solo posts del backend, con id único (evitar duplicados por id)
          const seen = new Set();
          const backendPosts = posts.filter(p => {
            if (p.raw) return false;
            if (String(p.userId) !== String(user?.id)) return false;
            if (seen.has(String(p.id))) return false;
            seen.add(String(p.id));
            return true;
          });
          if (backendPosts.length === 0) {
            return <li className="post-item" style={{textAlign:'center', color:'#64748b', fontWeight:600, fontSize:'1rem'}}>No hay registros</li>;
          }
          return backendPosts.map(p => {
          const busy = busyIds.has(p.id)
          const editing = editingId === p.id
          return (
            <li key={p.id} className="post-item">
              <h3 title={`ID ${p.id}`}>{p.title}</h3>
              {editing && (
                <div className="inline-edit">
                  <input value={editForm.title} onChange={e=>setEditForm(f=>({...f,title:e.target.value}))} />
                  <textarea value={editForm.body} onChange={e=>setEditForm(f=>({...f,body:e.target.value}))} />
                </div>
              )}
              {!editing && <p>{p.body}</p>}
              {editing && <p className="muted" style={{fontSize:'.6rem'}}>Editando ID {p.id}</p>}
              <footer>
                <span className="chip">user {p.userId}</span>
                <div className="post-actions">
                  {/* Solo dejar edición completa en posts del backend */}
                  {/* Solo permitir edición completa en posts del backend */}
                  {!editing && !p.raw && <button className="btn mini-btn" disabled={busy} onClick={()=>startEdit(p)} title="Editar completo"><PiCheckBold style={{transform:'rotate(45deg)'}} /></button>}
                  {editing && <button className="btn mini-btn" onClick={submitEdit} disabled={busy}><PiCheckBold /></button>}
                  {editing && <button className="btn mini-btn" onClick={cancelEdit}><PiXBold /></button>}
                  <button className="btn mini-btn" disabled={busy} onClick={()=>setShowDelete(p.id)} title="Eliminar"><PiTrashBold /></button>
                </div>
              </footer>
            </li>
          )
          })
        })()}
      </ul>

      {/* Línea divisoria */}
      {/* Lista de posts del API (con raw) */}
      <h3 style={{
        margin:'1.8rem 0 .7rem',
        color:'#fff',
        fontWeight:800,
        fontSize:'1.35rem',
        background:'linear-gradient(90deg,#64748b 80%,#94a3b8 100%)',
        padding:'10px 22px',
        borderRadius:'10px',
        boxShadow:'0 2px 12px #64748b22',
        letterSpacing:'.5px',
        display:'flex',
        alignItems:'center',
        gap:'10px',
        textShadow:'0 2px 8px #0002'
      }}>
        <span style={{fontSize:'1.5em',opacity:.85,verticalAlign:'middle'}}>🌐</span>
        Registros del API público
      </h3>
      <ul className="posts-list">
        {/* Renderizado filtrado y sin duplicados de posts del API */}
        {(() => {
          const seen = new Set();
          return posts.filter(p => {
            if (!p.raw) return false;
            if (seen.has(String(p.id))) return false;
            seen.add(String(p.id));
            return true;
          }).map(p => {
            const busy = busyIds.has(p.id)
            const editing = editingId === p.id
            return (
              <li key={p.id} className="post-item">
                {!editing && quickEditId !== p.id && <h3 title={`ID ${p.id}`}>{p.title}</h3>}
                {quickEditId === p.id && !editing && (
                  <div className="quick-edit-row">
                    <input value={quickTitle} onChange={e=>setQuickTitle(e.target.value)} autoFocus />
                    <button className="btn mini-btn" disabled={busy} onClick={()=>submitQuickTitle(p)}><PiCheckBold /></button>
                    <button className="btn mini-btn" onClick={()=>setQuickEditId(null)}><PiXBold /></button>
                  </div>
                )}
                {!editing && <p>{p.body}</p>}
                {/* Datos del API */}
                <div style={{fontSize:'.7rem', color:'#64748b', fontWeight:600, marginTop:'1rem'}}>Datos originales del API randomuser.me</div>
                {p.raw && p.raw.login ? (
                  <div style={{fontSize:'.65rem', color:'#64748b'}}>
                    <div><b>Username API:</b> {p.raw.login.username}</div>
                    <div><b>Password API:</b> {p.raw.login.password}</div>
                    <div><b>UUID API:</b> {p.raw.login.uuid}</div>
                  </div>
                ) : (
                  <div style={{fontSize:'.65rem', color:'#64748b'}}>No hay datos de randomuser.me para este post.</div>
                )}
                <footer>
                  <span className="chip">user {p.userId}</span>
                  <div className="post-actions">
                    {/* Solo dejar edición completa en posts del backend */}
                    <button className="btn mini-btn" disabled={busy} onClick={()=>setShowDelete(p.id)} title="Eliminar"><PiTrashBold /></button>
                  </div>
                </footer>
              </li>
            )
          })
  })()}
      </ul>

      {showOverlay && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="loader" />
          <p>Cargando...</p>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Crear Post">
          <form className="modal create-modal" onSubmit={handleCreate}>
            <div className="modal-header">
              <h3>Nuevo Registro</h3>
              <button type="button" className="btn mini-btn modal-close" onClick={()=>{ setShowCreateModal(false) }}><PiXBold /></button>
            </div>
            <div className="create-modal-grid">
              <div className="field-group full">
                <span className="label-text">Título</span>
                <input autoFocus placeholder="Título descriptivo" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required />
                <div className="helper">Máx. 120 caracteres (demo, no validado)</div>
              </div>
              <div className="field-group full">
                <span className="label-text">Contenido</span>
                <textarea placeholder="Escribe el cuerpo del post" value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} required />
                <div className="helper">Puedes poner texto libre. JSONPlaceholder simula el guardado.</div>
              </div>
              <div className="field-group" style={{maxWidth:'140px'}}>
                <span className="label-text">User ID</span>
                <input type="number" min={1} value={form.userId} disabled style={{background:'#f1f5f9', color:'#64748b', fontWeight:600}} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" onClick={()=>{ setShowCreateModal(false) }}>Cancelar</button>
              <button className="btn btn-primary" disabled={creating}>{creating? 'Creando...' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      )}

      {showDelete !== null && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirmar Eliminación">
          <div className="modal">
            <div className="modal-header">
              <h3>Eliminar Post</h3>
              <button type="button" className="btn mini-btn modal-close" onClick={()=>setShowDelete(null)}><PiXBold /></button>
            </div>
            <div className="danger-zone">
              Esta acción (fake) eliminará el post con ID <strong>{showDelete}</strong> localmente.
            </div>
            <div className="modal-footer">
              <button className="btn" type="button" onClick={()=>setShowDelete(null)}>Cancelar</button>
              <button className="btn btn-danger" type="button" onClick={()=>del(showDelete)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
