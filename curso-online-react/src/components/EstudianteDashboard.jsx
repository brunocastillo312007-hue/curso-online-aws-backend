import React from 'react';

export default function EstudianteDashboard({ 
  misInscripciones, 
  cancelarInscripcion, 
  cursosDisponibles, 
  inscribirCurso, 
  modoOscuro 
}) {
  // Clases dinámicas según el modo oscuro
  const cardBgClass = modoOscuro ? 'bg-dark text-light border border-secondary shadow-none' : 'bg-light text-dark';

  return (
    <div className={`h-100 overflow-y-auto ${modoOscuro ? 'text-light' : 'text-dark'}`}>
      
      {/* SECCIÓN 1: MIS CURSOS MATRICULADOS */}
      <div className="mb-4">
        <h4 className="fw-bold mb-3 text-primary">🎓 Mis Cursos Matriculados</h4>
        {!misInscripciones || misInscripciones.length === 0 ? (
          <div className={`text-center py-4 rounded ${modoOscuro ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted'}`}>
            Aún no estás inscrito en ningún curso. ¡Explora el catálogo de abajo e inscríbete!
          </div>
        ) : (
          <div className="row g-3">
            {misInscripciones.map((ins) => (
              <div className="col-md-6" key={ins.id}>
                <div className={`card border-0 shadow-sm p-4 h-100 d-flex flex-column justify-content-between ${cardBgClass}`}>
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold mb-0">{ins.curso?.titulo || ins.curso?.nombre}</h5>
                      <span className="badge bg-success text-white px-2 py-1">Inscrito</span>
                    </div>
                    <p className={`${modoOscuro ? 'text-light opacity-75' : 'text-muted'} small mb-3`}>
                      {ins.curso?.descripcion}
                    </p>
                  </div>
                  <div className={`d-flex justify-content-between align-items-center mt-3 pt-3 border-top ${modoOscuro ? 'border-secondary' : 'border-secondary-subtle'}`}>
                    <small className={`${modoOscuro ? 'text-light opacity-50' : 'text-secondary'} fw-semibold`}>
                      Inscripción #{ins.id}
                    </small>
                    <button 
                      className="btn btn-outline-danger btn-sm px-3 shadow-sm"
                      onClick={() => cancelarInscripcion(ins.id)}>
                      Cancelar Matrícula
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECCIÓN 2: CATÁLOGO DE CURSOS DISPONIBLES */}
      <div>
        <h4 className="fw-bold mb-3">📚 Catálogo de Cursos Disponibles</h4>
        {!cursosDisponibles || cursosDisponibles.length === 0 ? (
          <div className={`text-center py-4 rounded ${modoOscuro ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted'}`}>
            No hay cursos disponibles en este momento.
          </div>
        ) : (
          <div className="row g-3">
            {cursosDisponibles.map((curso) => {
              // Verificamos si el estudiante ya está inscrito en este curso
              const yaInscrito = misInscripciones.some(ins => ins.curso?.id === curso.id);

              return (
                <div className="col-md-6" key={curso.id}>
                  <div className={`card border-0 shadow-sm p-4 h-100 d-flex flex-column justify-content-between ${cardBgClass}`}>
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-0">{curso.titulo || curso.nombre}</h5>
                        <span className="badge bg-primary text-white px-3 py-2">$ {curso.precio}</span>
                      </div>
                      <p className={`${modoOscuro ? 'text-light opacity-75' : 'text-muted'} small mb-3`}>
                        {curso.descripcion}
                      </p>
                    </div>
                    <div className={`d-flex justify-content-between align-items-center mt-3 pt-3 border-top ${modoOscuro ? 'border-secondary' : 'border-secondary-subtle'}`}>
                      <small className={`${modoOscuro ? 'text-light opacity-50' : 'text-secondary'} fw-semibold`}>
                        ID: #{curso.id}
                      </small>
                      {yaInscrito ? (
                        <span className="badge bg-secondary text-white px-3 py-2">Ya Matriculado</span>
                      ) : (
                        <button 
                          className="btn btn-success btn-sm px-3 shadow-sm"
                          onClick={() => inscribirCurso(curso.id)}>
                          Inscribirse al Curso
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}