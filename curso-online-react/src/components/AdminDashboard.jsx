import React, { useState } from 'react';

export default function AdminDashboard({ usuariosAdmin, aprobarCuentaUsuario, cambiarRolUsuario, eliminarUsuario, cursosDisponibles, seccionActiva, eliminarCurso, modoOscuro }) {
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [busquedaCurso, setBusquedaCurso] = useState('');

  const usuariosFiltrados = usuariosAdmin.filter(u => 
    u.nombre.toLowerCase().includes(busquedaUsuario.toLowerCase()) || 
    u.correo.toLowerCase().includes(busquedaUsuario.toLowerCase())
  );

  const cursosFiltrados = cursosDisponibles.filter(c => 
    (c.nombre || c.titulo || '').toLowerCase().includes(busquedaCurso.toLowerCase()) || 
    (c.descripcion || '').toLowerCase().includes(busquedaCurso.toLowerCase())
  );

  const totalUsuarios = usuariosAdmin.length;
  const totalAprobados = usuariosAdmin.filter(u => u.estado === 'APROBADA').length;
  const totalPendientes = usuariosAdmin.filter(u => u.estado !== 'APROBADA').length;
  const totalCursos = cursosDisponibles ? cursosDisponibles.length : 0;

  // Clases dinámicas según el modo oscuro
  const cardBgClass = modoOscuro ? 'bg-dark text-light border border-secondary shadow-none' : 'bg-light text-dark';
  const tableContainerClass = modoOscuro ? 'bg-dark text-light' : 'bg-white';

  return (
    <div className={`h-100 overflow-y-auto ${modoOscuro ? 'text-light' : 'text-dark'}`}>
      {/* TARJETAS DE ESTADÍSTICAS (KPIs) */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className={`card border-0 shadow-sm p-3 rounded-3 ${cardBgClass}`}>
            <small className={`${modoOscuro ? 'text-light opacity-75' : 'text-muted'} fw-bold`}>TOTAL USUARIOS</small>
            <h3 className="fw-bold mt-1 mb-0">{totalUsuarios}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className={`card border-0 shadow-sm p-3 rounded-3 ${cardBgClass}`}>
            <small className={`${modoOscuro ? 'text-light opacity-75' : 'text-muted'} fw-bold`}>APROBADOS</small>
            <h3 className="fw-bold text-success mt-1 mb-0">{totalAprobados}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className={`card border-0 shadow-sm p-3 rounded-3 ${cardBgClass}`}>
            <small className={`${modoOscuro ? 'text-light opacity-75' : 'text-muted'} fw-bold`}>PENDIENTES</small>
            <h3 className="fw-bold text-warning mt-1 mb-0">{totalPendientes}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className={`card border-0 shadow-sm p-3 rounded-3 ${cardBgClass}`}>
            <small className={`${modoOscuro ? 'text-light opacity-75' : 'text-muted'} fw-bold`}>CURSOS CREADOS</small>
            <h3 className="fw-bold text-primary mt-1 mb-0">{totalCursos}</h3>
          </div>
        </div>
      </div>

      {/* VISTA 1: GESTIÓN DE USUARIOS */}
      {seccionActiva === 'usuarios' && (
        <div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h4 className="fw-bold mb-1">Usuarios del Sistema</h4>
              <p className={`${modoOscuro ? 'text-light opacity-75' : 'text-muted'} small mb-0`}>Administra cuentas, aprueba accesos y cambia roles.</p>
            </div>
            <div style={{ width: '280px' }}>
              <input 
                type="text" 
                className={`form-control form-control-sm ${modoOscuro ? 'bg-dark text-light border-secondary' : ''}`} 
                placeholder="🔍 Buscar por nombre o correo..." 
                value={busquedaUsuario}
                onChange={e => setBusquedaUsuario(e.target.value)}
              />
            </div>
          </div>

          <div className={`table-responsive rounded ${modoOscuro ? 'bg-dark border border-secondary p-2' : ''}`}>
            <table className={`table align-middle table-hover ${modoOscuro ? 'table-dark text-light border-secondary' : 'border-top'}`}>
              <thead className={modoOscuro ? 'table-secondary text-dark' : 'table-dark'}>
                <tr>
                  <th className="py-3"># ID</th>
                  <th className="py-3">Nombre y Correo</th>
                  <th className="py-3">Estado</th>
                  <th className="py-3">Rol Actual</th>
                  <th className="py-3 text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No se encontraron usuarios coincidentes.</td>
                  </tr>
                ) : (
                  usuariosFiltrados.map(u => (
                    <tr key={u.id}>
                      <td className={`fw-semibold ${modoOscuro ? 'text-light' : 'text-secondary'}`}>#{u.id}</td>
                      <td>
                        <div className={`fw-bold ${modoOscuro ? 'text-light' : 'text-dark'}`}>{u.nombre}</div>
                        <small className={modoOscuro ? 'text-light opacity-50' : 'text-muted'}>{u.correo}</small>
                      </td>
                      <td>
                        <span className={`badge px-2 py-1 ${u.estado === 'APROBADA' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning border border-warning-subtle'}`}>
                          {u.estado || 'PENDIENTE'}
                        </span>
                      </td>
                      <td>
                        <select 
                          className={`form-select form-select-sm shadow-sm ${modoOscuro ? 'bg-dark text-light border-secondary' : ''}`} 
                          style={{ width: '140px' }}
                          value={u.rol || 'ESTUDIANTE'} 
                          onChange={(e) => cambiarRolUsuario(u.id, e.target.value)}>
                          <option value="ESTUDIANTE">ESTUDIANTE</option>
                          <option value="PROFESOR">PROFESOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          {u.estado !== 'APROBADA' && (
                            <button className="btn btn-success btn-sm px-3 shadow-sm" onClick={() => aprobarCuentaUsuario(u.id)}>
                              Aprobar
                            </button>
                          )}
                          <button className="btn btn-outline-danger btn-sm px-3 shadow-sm" onClick={() => eliminarUsuario(u.id)}>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 2: CATÁLOGO DE CURSOS */}
      {seccionActiva === 'cursos' && (
        <div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h4 className="fw-bold mb-1">Cursos Registrados en la Plataforma</h4>
              <p className={`${modoOscuro ? 'text-light opacity-75' : 'text-muted'} small mb-0`}>Visualiza y administra todas las materias impartidas.</p>
            </div>
            <div style={{ width: '280px' }}>
              <input 
                type="text" 
                className={`form-control form-control-sm ${modoOscuro ? 'bg-dark text-light border-secondary' : ''}`} 
                placeholder="🔍 Buscar curso..." 
                value={busquedaCurso}
                onChange={e => setBusquedaCurso(e.target.value)}
              />
            </div>
          </div>

          {!cursosFiltrados || cursosFiltrados.length === 0 ? (
            <div className={`text-center py-5 rounded ${modoOscuro ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted'}`}>No hay cursos coincidentes en el sistema.</div>
          ) : (
            <div className="row g-3">
              {cursosFiltrados.map(c => (
                <div className="col-md-6" key={c.id}>
                  <div className={`card border-0 shadow-sm p-4 h-100 d-flex flex-column justify-content-between ${cardBgClass}`}>
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-0">{c.nombre || c.titulo}</h5>
                        <span className="badge bg-primary text-white px-3 py-2">$ {c.precio}</span>
                      </div>
                      <p className={`${modoOscuro ? 'text-light opacity-75' : 'text-muted'} small mb-3`}>{c.descripcion}</p>
                    </div>
                    <div className={`d-flex justify-content-between align-items-center mt-3 pt-3 border-top ${modoOscuro ? 'border-secondary' : 'border-secondary-subtle'}`}>
                      <small className={`${modoOscuro ? 'text-light opacity-50' : 'text-secondary'} fw-semibold`}>ID del Curso: #{c.id}</small>
                      <button 
                        className="btn btn-outline-danger btn-sm px-3 shadow-sm"
                        onClick={() => eliminarCurso(c.id)}>
                        Eliminar Curso
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}