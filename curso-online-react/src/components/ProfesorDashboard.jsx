import React from 'react';

export default function ProfesorDashboard({ 
  nuevoCurso, 
  setNuevoCurso, 
  registrarCurso, 
  misCursosProf, 
  misInscripciones, 
  modoOscuro 
}) {
  // Clases dinámicas según el modo oscuro
  const cardBgClass = modoOscuro ? 'bg-dark text-light border border-secondary shadow-none' : 'bg-light text-dark';
  const inputBgClass = modoOscuro ? 'bg-dark text-light border-secondary' : '';

  return (
    <div className={`h-100 overflow-y-auto ${modoOscuro ? 'text-light' : 'text-dark'}`}>
      
      {/* SECCIÓN 1: CREAR NUEVO CURSO */}
      <div className={`card border-0 shadow-sm p-4 mb-4 rounded-4 ${cardBgClass}`}>
        <h4 className="fw-bold mb-3 text-primary">✨ Crear Nuevo Curso</h4>
        <form onSubmit={registrarCurso}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Título</label>
              <input 
                type="text" 
                className={`form-control ${inputBgClass}`} 
                placeholder="Ej. Spring Boot Avanzado" 
                value={nuevoCurso.titulo} 
                onChange={e => setNuevoCurso({ ...nuevoCurso, titulo: e.target.value })} 
                required 
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Nombre del Curso</label>
              <input 
                type="text" 
                className={`form-control ${inputBgClass}`} 
                placeholder="Ej. Backend Java" 
                value={nuevoCurso.nombre} 
                onChange={e => setNuevoCurso({ ...nuevoCurso, nombre: e.target.value })} 
                required 
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold small">Descripción</label>
              <textarea 
                className={`form-control ${inputBgClass}`} 
                rows="3" 
                placeholder="Detalles del contenido..." 
                value={nuevoCurso.descripcion} 
                onChange={e => setNuevoCurso({ ...nuevoCurso, descripcion: e.target.value })} 
                required 
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Precio ($)</label>
              <input 
                type="number" 
                className={`form-control ${inputBgClass}`} 
                value={nuevoCurso.precio} 
                onChange={e => setNuevoCurso({ ...nuevoCurso, precio: e.target.value })} 
                required 
              />
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100 shadow-sm fw-semibold">
                Publicar Curso
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: MIS CURSOS IMPARTIDOS */}
      <div className="mb-4">
        <h5 className="fw-bold mb-3">📚 Mis Cursos Impartidos</h5>
        {!misCursosProf || misCursosProf.length === 0 ? (
          <div className={`text-center py-4 rounded ${modoOscuro ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted'}`}>
            No has creado ningún curso todavía.
          </div>
        ) : (
          <div className="row g-3">
            {misCursosProf.map(c => (
              <div className="col-md-6" key={c.id}>
                <div className={`card border-0 shadow-sm p-3 h-100 ${cardBgClass}`}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0">{c.titulo || c.nombre}</h5>
                    <span className="badge bg-primary text-white px-2 py-1">$ {c.precio}</span>
                  </div>
                  <p className={`${modoOscuro ? 'text-light opacity-75' : 'text-muted'} small mb-0`}>{c.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECCIÓN 3: ESTUDIANTES INSCRITOS */}
      <div>
        <h5 className="fw-bold mb-3">🎓 Alumnos Matriculados en tus Cursos</h5>
        {!misInscripciones || misInscripciones.length === 0 ? (
          <div className={`text-center py-4 rounded ${modoOscuro ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted'}`}>
            No hay estudiantes inscritos en tus cursos actualmente.
          </div>
        ) : (
          <div className="table-responsive">
            <table className={`table align-middle table-hover ${modoOscuro ? 'table-dark text-light border-secondary' : 'border-top'}`}>
              <thead className={modoOscuro ? 'table-secondary text-dark' : 'table-dark'}>
                <tr>
                  <th>Estudiante</th>
                  <th>Correo</th>
                  <th>Curso Matriculado</th>
                </tr>
              </thead>
              <tbody>
                {misInscripciones.map((ins, index) => (
                  <tr key={index}>
                    <td className="fw-bold">{ins.estudiante?.nombre || 'Estudiante'}</td>
                    <td className={modoOscuro ? 'text-light opacity-75' : 'text-muted'}>{ins.estudiante?.correo}</td>
                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">{ins.curso?.titulo || ins.curso?.nombre}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}