import React from 'react';

export default function ModalForm({
  show,
  title,
  icon,
  fields = [],
  onChange,
  onSubmit,
  onClose,
  error,
  submitLabel = 'Guardar',
}) {
  const [localError, setLocalError] = React.useState({});

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validateDocument(doc) {
    return /^\d{10}$/.test(doc);
  }

  function validatePhone(phone) {
    return /^\d{10,}$/.test(phone);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let errors = {};
    let values = {};
    fields.forEach(f => { values[f.name] = f.value; });
    if ('document' in values && !validateDocument(values.document)) {
      errors.document = 'La cédula debe ser numérica y tener exactamente 10 dígitos.';
    }
    if ('email' in values && !validateEmail(values.email)) {
      errors.email = 'El correo no es válido.';
    }
    if ('phone' in values && !validatePhone(values.phone)) {
      errors.phone = 'El teléfono debe tener al menos 10 dígitos.';
    }
    setLocalError(errors);
    if (Object.keys(errors).length > 0) return;
    if (onSubmit) onSubmit(e);
  }

  if (!show) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Fondo opaco */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.35)',
        zIndex: 1
      }} onClick={onClose}></div>
      {/* Card modal */}
      <div className="card shadow-lg p-0" style={{minWidth: 370, maxWidth: 420, width: '100%', borderRadius: '1.3rem', zIndex: 2, position: 'relative'}}>
        {/* Botón X arriba a la derecha */}
        <button type="button" className="btn btn-light btn-sm d-flex align-items-center justify-content-center" style={{position:'absolute', top:14, right:14, width:32, height:32, borderRadius:'50%', fontSize:20, border:'none', boxShadow:'0 1px 4px #0001', zIndex:10}} onClick={onClose} aria-label="Cerrar">
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="card-header bg-white border-0 pb-0 d-flex align-items-center" style={{borderRadius:'1.3rem 1.3rem 0 0'}}>
          <h5 className="fw-bold mb-0">
            {icon}{title}
          </h5>
        </div>
  <form onSubmit={handleSubmit} autoComplete="off">
          <div className="card-body pt-3 pb-2 px-4">
            {fields.map(field => (
              <div className="mb-3" key={field.name}>
                <label className="form-label">
                  {field.label}
                  {field.required && <span className="text-danger ms-1">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    className="form-control"
                    value={field.value}
                    onChange={e => onChange(field.name, e.target.value)}
                    required={field.required}
                  >
                    <option value="">Seleccione...</option>
                    {field.options && field.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    className="form-control"
                    value={field.value}
                    onChange={e => onChange(field.name, e.target.value)}
                    required={field.required}
                    autoFocus={field.autoFocus}
                  />
                )}
                {localError && localError[field.name] && (
                  <div style={{ color: '#dc2626', fontSize: '.92em', marginTop: 2 }}>{localError[field.name]}</div>
                )}
              </div>
            ))}
            {error && (
              <div style={{ color: '#dc2626', fontSize: '.97em', marginTop: 8, marginBottom: 0, textAlign: 'right' }}>{error}</div>
            )}
          </div>
          <div style={{height: '1.5rem'}}></div>
          <div className="card-footer bg-white border-0 pb-3 px-4 d-flex justify-content-end" style={{borderRadius:'0 0 1.3rem 1.3rem'}}>
            <div className="d-flex gap-4">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">{submitLabel}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
