import React from 'react';

export default function Navbar({ nombreUsuario, rolUsuario, cerrarSesion }) {
  return (
    <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-3">
        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '45px', height: '45px', fontSize: '1.2rem' }}>
          {nombreUsuario ? nombreUsuario.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h5 className="mb-0 fw-bold text-dark">{nombreUsuario}</h5>
          <span className="badge bg-light text-primary border border-primary-subtle px-2 py-1 mt-1" style={{ fontSize: '0.75rem' }}>
            Rol: {rolUsuario}
          </span>
        </div>
      </div>
      <button onClick={cerrarSesion} className="btn btn-outline-danger btn-sm px-3 d-flex align-items-center gap-1">
        <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
      </button>
    </div>
  );
}