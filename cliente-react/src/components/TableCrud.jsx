import React, { useState } from 'react';
import './TableCrud.css';
import { PiPencilBold, PiTrashBold, PiUsersBold, PiEyeBold } from 'react-icons/pi';

/**
 * TableCrud
 * Props:
 * - columns: array de { key, label }
 * - data: array de objetos (los registros)
 * - onEdit: function (row) (opcional)
 * - onDelete: function (row) (opcional)
 * - loading: boolean (opcional)
 * - emptyText: string (opcional)
 *
 * Ejemplo de uso:
 * <TableCrud
 *   columns={[
 *     { key: 'number', label: 'Número' },
 *     { key: 'type', label: 'Tipo' },
 *     { key: 'capacity', label: 'Capacidad' },
 *     { key: 'status', label: 'Estado' },
 *   ]}
 *   data={rooms}
 *   onEdit={room => ...}
 *   onDelete={room => ...}
 *   loading={loading}
 *   emptyText="No hay habitaciones registradas."
 * />
 */
export default function TableCrud({ columns, data, onEdit, onDelete, onView, onValidate, loading, emptyText }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  // Render especial para habitaciones
  function renderCell(col, row) {
    if (col.key === 'status') {
      const status = row.status;
      let badgeClass = 'bg-secondary';
      // Habitaciones
      if (status === 'disponible') badgeClass = 'bg-success';
      else if (status === 'ocupada') badgeClass = 'bg-danger';
      else if (status === 'mantenimiento') badgeClass = 'bg-warning text-dark';
      // Reservas
      else if (status === 'pendiente') badgeClass = 'bg-warning text-dark';
      else if (status === 'confirmada') badgeClass = 'bg-success';
      else if (status === 'cancelada') badgeClass = 'bg-danger';
      else if (status === 'finalizada') badgeClass = 'bg-primary';
      return <span className={`badge ${badgeClass}`}>{status ? status.charAt(0).toUpperCase() + status.slice(1) : ''}</span>;
    }
    if (col.key === 'capacity') {
      return <span><PiUsersBold style={{marginRight: 6, fontSize: '1.1em', verticalAlign: 'middle'}} /> {row.capacity}</span>;
    }
    return row[col.key];
  }
  // Validación para edición/creación
  function handleEdit(row) {
    if (onValidate) {
      const error = onValidate(row);
      if (error) {
        alert(error);
        return;
      }
    }
    if (onEdit) onEdit(row);
  }

  // Validación para creación (si se usa onValidate en onEdit)
  function handleCreate(row) {
    if (onValidate) {
      const error = onValidate(row);
      if (error) {
        alert(error);
        return false;
      }
    }
    return true;
  }

  return (
    <div className="table-responsive">
      <table className="table table-crud align-middle table-hover border">
        <thead className="table-light">
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(onView || onEdit || onDelete) && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={columns.length + 1} className="text-center">Cargando...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="text-center text-muted">{emptyText || 'Sin registros.'}</td></tr>
          ) : (
            data.map(row => (
              <tr key={row.id || JSON.stringify(row)} className="table-row-crud">
                {columns.map(col => (
                  <td key={col.key}>{col.render ? col.render(row) : renderCell(col, row)}</td>
                ))}
                {(onView || onEdit || onDelete) && (
                  <td>
                    <div className="d-flex gap-2" style={{gap: '10px'}}>
                      {onView && <button className="btn btn-sm btn-primary" onClick={() => onView(row)} title="Ver"><PiEyeBold /></button>}
                      {onEdit && <button className="btn btn-sm btn-warning" onClick={() => handleEdit(row)} title="Editar"><PiPencilBold /></button>}
                      {onDelete && <button className="btn btn-sm btn-danger" onClick={() => { setRowToDelete(row); setShowDeleteModal(true); }} title="Eliminar"><PiTrashBold /></button>}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <style>{`
        .table-row-crud:hover { background: #f1f5f9; }
        .badge.bg-success { background: #22c55e !important; }
        .badge.bg-danger { background: #ef4444 !important; }
        .badge.bg-warning { background: #fbbf24 !important; }
  .badge.bg-primary { background: #3b82f6 !important; }
  .badge.bg-warning.text-dark { color: #b45309 !important; background: #fbbf24 !important; }
  .badge.bg-danger { background: #ef4444 !important; }
  .badge.bg-success { background: #22c55e !important; }
  .modal-backdrop-crud {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(30,41,59,0.32);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-crud {
          background: var(--color-surface, #f8fafc);
          color: #fff;
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          padding: 2.2rem 2.2rem 1.5rem 2.2rem;
          min-width: 320px;
          max-width: 95vw;
          text-align: center;
        }
        .modal-crud h5, .modal-crud .btn, .modal-crud div, .modal-crud p, .modal-crud span {
          color: #fff !important;
        }
        .modal-crud h5 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.2rem; color: #1e293b; }
        .modal-crud .btn { margin: 0 0.5rem; min-width: 90px; }
      `}</style>

      {showDeleteModal && (
        <div className="modal-backdrop-crud">
          <div className="modal-crud">
            <h5>¿Seguro que deseas eliminar este registro?</h5>
            <div style={{marginBottom: '1.2rem', color: '#64748b', fontSize: '.98rem'}}>
              Esta acción no se puede deshacer.
            </div>
            <div>
              <button className="btn btn-danger" onClick={async () => {
                setDeleteError(null);
                if (onDelete && rowToDelete) {
                  try {
                    await onDelete(rowToDelete);
                    setShowDeleteModal(false);
                    setRowToDelete(null);
                  } catch (err) {
                    setDeleteError(err?.message || (err?.error) || 'Error al eliminar');
                  }
                }
              }}>Eliminar</button>
              <button className="btn btn-secondary" onClick={() => {
                setShowDeleteModal(false);
                setRowToDelete(null);
                setDeleteError(null);
              }}>Cancelar</button>
            </div>
            {deleteError && <div style={{ color: '#ef4444', marginTop: 10, fontWeight: 500 }}>{deleteError}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
