import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { apiService } from '../services/api.service';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { 
  FaUsers, 
  FaBook, 
  FaGraduationCap, 
  FaSignOutAlt, 
  FaMoon, 
  FaSun, 
  FaFont, 
  FaShieldAlt 
} from 'react-icons/fa';

import App from '../App';
import AdminDashboard from '../components/AdminDashboard';
import ProfesorDashboard from '../components/ProfesorDashboard';
import EstudianteDashboard from '../components/EstudianteDashboard';

// 🧭 VISTA PROTEGIDA CON MENÚ LATERAL Y ICONOGRAFÍA PROFESIONAL
const VistaConSidebar = ({ rolRequerido, children, seccionActiva, setSeccionActiva }) => {
  const token = localStorage.getItem('token');
  const rolActual = localStorage.getItem('rol');
  const nombreUsuario = localStorage.getItem('nombre') || 'Usuario';

  const [tamanioLetra, setTamanioLetra] = useState('normal');
  const [modoOscuro, setModoOscuro] = useState(false);
  
  if (!token) return <Navigate to="/" replace />;
  if (rolRequerido && rolActual !== rolRequerido) return <Navigate to="/" replace />;

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const obtenerClaseTamanio = () => {
    if (tamanioLetra === 'grande') return 'fs-5';
    if (tamanioLetra === 'extragrande') return 'fs-4';
    return 'fs-6';
  };

  return (
    <div 
      className={`container-fluid p-0 m-0 ${modoOscuro ? 'bg-black text-light' : 'bg-light'} ${obtenerClaseTamanio()}`}
      style={{ height: '100vh', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div className="row h-100 g-0 m-0">
        
        {/* MENÚ LATERAL (SIDEBAR) */}
        <div className="col-12 col-md-3 col-lg-2 text-white d-flex flex-column p-3 p-md-4 shadow" 
             style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)', minHeight: '100%' }}>
          
          {/* Logo / Título */}
          <div className="mb-3 pb-2 border-bottom border-white border-opacity-25 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
                <FaGraduationCap className="fs-4" /> CursoOnline
              </h5>
              <small className="text-white-50 text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                <FaShieldAlt /> Panel de {rolActual}
              </small>
            </div>
          </div>

          {/* Widgets de Accesibilidad y Tema con Iconos */}
          <div className="d-flex flex-column gap-2 mb-3">
            <div className="p-2 bg-white bg-opacity-10 rounded border border-white border-opacity-25">
              <small className="text-white-50 d-block mb-1 fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                <FaFont /> Texto:
              </small>
              <div className="btn-group w-100" role="group">
                <button className={`btn btn-sm ${tamanioLetra === 'normal' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`} onClick={() => setTamanioLetra('normal')}>A</button>
                <button className={`btn btn-sm ${tamanioLetra === 'grande' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`} onClick={() => setTamanioLetra('grande')}>A+</button>
                <button className={`btn btn-sm ${tamanioLetra === 'extragrande' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`} onClick={() => setTamanioLetra('extragrande')}>A++</button>
              </div>
            </div>

            <div className="p-2 bg-white bg-opacity-10 rounded border border-white border-opacity-25 d-flex align-items-center justify-content-between">
              <small className="text-white-50 fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                {modoOscuro ? <FaMoon /> : <FaSun />} Tema:
              </small>
              <button className={`btn btn-sm px-3 ${modoOscuro ? 'btn-light text-dark fw-bold' : 'btn-outline-light'}`} onClick={() => setModoOscuro(!modoOscuro)}>
                {modoOscuro ? '☀️ Claro' : '🌙 Oscuro'}
              </button>
            </div>
          </div>

          {/* Opciones de Navegación con Iconos Vectoriales */}
          <div className="nav flex-row flex-md-column gap-2 mb-3 mb-md-auto overflow-x-auto pb-2 pb-md-0">
            {rolActual === 'ADMIN' && (
              <>
                <button 
                  className={`btn text-start py-2 px-3 fw-semibold border-0 text-nowrap d-flex align-items-center gap-2 ${seccionActiva === 'usuarios' ? 'bg-white text-primary shadow-sm' : 'text-white bg-transparent'}`}
                  onClick={() => setSeccionActiva('usuarios')}>
                  <FaUsers /> Usuarios
                </button>
                <button 
                  className={`btn text-start py-2 px-3 fw-semibold border-0 text-nowrap d-flex align-items-center gap-2 ${seccionActiva === 'cursos' ? 'bg-white text-primary shadow-sm' : 'text-white bg-transparent'}`}
                  onClick={() => setSeccionActiva('cursos')}>
                  <FaBook /> Cursos
                </button>
              </>
            )}

            {rolActual === 'PROFESOR' && (
              <button className="btn bg-white text-primary text-start py-2 px-3 fw-semibold shadow-sm border-0 text-nowrap d-flex align-items-center gap-2">
                <FaBook /> Mis Cursos y Alumnos
              </button>
            )}

            {rolActual === 'ESTUDIANTE' && (
              <button className="btn bg-white text-primary text-start py-2 px-3 fw-semibold shadow-sm border-0 text-nowrap d-flex align-items-center gap-2">
                <FaGraduationCap /> Matrículas y Catálogo
              </button>
            )}
          </div>

          {/* Información del Usuario y Botón de Salida con Icono */}
          <div className="pt-3 border-top border-white border-opacity-25 mt-md-auto d-flex flex-column">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-2 shadow-sm" style={{ width: '35px', height: '35px', fontSize: '0.9rem' }}>
                {nombreUsuario.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h6 className="mb-0 text-white text-truncate small fw-bold">{nombreUsuario}</h6>
                <small className="text-white-50 text-truncate d-block" style={{ fontSize: '0.75rem' }}>{rolActual}</small>
              </div>
            </div>
            <button onClick={cerrarSesion} className="btn btn-outline-light btn-sm w-100 py-2 border-opacity-50 d-flex align-items-center justify-content-center gap-2">
              <FaSignOutAlt /> Cerrar Sesión
            </button>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL DERECHO */}
        <div className="col-12 col-md-9 col-lg-10 h-100 overflow-y-auto p-3 p-md-4 p-lg-5">
          <div className={`card border-0 shadow-sm p-3 p-md-4 rounded-4 h-100 ${modoOscuro ? 'bg-dark text-light border border-secondary' : 'bg-white text-dark'}`}>
            {React.isValidElement(children) ? React.cloneElement(children, { modoOscuro }) : children}
          </div>
        </div>

      </div>
    </div>
  );
};

// Contenedor inteligente para ADMIN
const AdminVista = () => {
  const [usuariosAdmin, setUsuariosAdmin] = useState([]);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState('usuarios');
  const [cargando, setCargando] = useState(true);

  const cargarDatosAdmin = async () => {
    try {
      const resUsr = await apiService.obtenerUsuariosAdmin();
      setUsuariosAdmin(resUsr.data);
      const resCat = await apiService.obtenerCatalogoCursos();
      setCursosDisponibles(resCat.data);
    } catch (err) {
      console.error("Error al cargar datos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarDatosAdmin(); }, []);

  const aprobar = async (id) => {
    try {
      await apiService.aprobarUsuario(id);
      toast.success("¡Usuario aprobado exitosamente!"); // 🟢 Notificación flotante de éxito
      cargarDatosAdmin();
    } catch (err) {
      toast.error("Error al aprobar el usuario."); // 🔴 Notificación de error
    }
  };

  const cambiarRol = async (id, rol) => {
    await apiService.actualizarRolUsuario(id, rol);
    cargarDatosAdmin();
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await apiService.eliminarUsuarioAdmin(id);
      toast.info("Usuario eliminado del sistema."); // 🔵 Notificación informativa
      cargarDatosAdmin();
    } catch (err) {
      toast.error("No se pudo eliminar el usuario.");
    }
  };

  const eliminarCurso = async (idCurso) => {
    if (!window.confirm("¿Estás seguro de eliminar este curso del sistema?")) return;
    try {
      await apiService.eliminarCursoAdmin(idCurso);
      cargarDatosAdmin();
    } catch (err) {
      console.error("Error al eliminar el curso:", err);
      alert("No se pudo eliminar el curso.");
    }
  };

  if (cargando) return <p className="text-center text-muted mt-5">Cargando panel...</p>;

  return (
    <VistaConSidebar rolRequerido="ADMIN" seccionActiva={seccionActiva} setSeccionActiva={setSeccionActiva}>
      <AdminDashboard 
        usuariosAdmin={usuariosAdmin} 
        aprobarCuentaUsuario={aprobar} 
        cambiarRolUsuario={cambiarRol} 
        eliminarUsuario={eliminarUsuario} 
        cursosDisponibles={cursosDisponibles}
        seccionActiva={seccionActiva}
        eliminarCurso={eliminarCurso}
      />
    </VistaConSidebar>
  );
};

// Contenedor inteligente para PROFESOR
const ProfesorVista = () => {
  const [misCursosProf, setMisCursosProf] = useState([]);
  const [misInscripciones, setMisInscripciones] = useState([]);
  const [nuevoCurso, setNuevoCurso] = useState({ titulo: '', nombre: '', descripcion: '', precio: 0 });
  const [cargando, setCargando] = useState(true);

  const cargarDatosProfesor = async () => {
    try {
      const resProf = await apiService.obtenerMisCursosProfesor();
      setMisCursosProf(resProf.data);
      const resInsP = await apiService.obtenerInscripcionesProfesor();
      setMisInscripciones(resInsP.data);
    } catch (err) {
      console.error("Error al cargar datos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarDatosProfesor(); }, []);

  const registrarCurso = async (e) => {
    e.preventDefault();
    await apiService.crearCurso(nuevoCurso);
    setNuevoCurso({ titulo: '', nombre: '', descripcion: '', precio: 0 });
    cargarDatosProfesor();
  };

  if (cargando) return <p className="text-center text-muted mt-5">Cargando panel...</p>;

  return (
    <VistaConSidebar rolRequerido="PROFESOR">
      <ProfesorDashboard 
        nuevoCurso={nuevoCurso} 
        setNuevoCurso={setNuevoCurso} 
        registrarCurso={registrarCurso} 
        misCursosProf={misCursosProf} 
        misInscripciones={misInscripciones} 
      />
    </VistaConSidebar>
  );
};

// Contenedor inteligente para ESTUDIANTE
const EstudianteVista = () => {
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [misInscripciones, setMisInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDatosEstudiante = async () => {
    try {
      const resCat = await apiService.obtenerCatalogoCursos();
      setCursosDisponibles(resCat.data);
      const resIns = await apiService.obtenerCursosEstudiante();
      setMisInscripciones(resIns.data);
    } catch (err) {
      console.error("Error al cargar datos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarDatosEstudiante(); }, []);

  const inscribir = async (id) => {
    await apiService.inscribirseCurso(id);
    cargarDatosEstudiante();
  };

  const cancelar = async (id) => {
    await apiService.eliminarInscripcion(id);
    cargarDatosEstudiante();
  };

  if (cargando) return <p className="text-center text-muted mt-5">Cargando panel...</p>;

  return (
    <VistaConSidebar rolRequerido="ESTUDIANTE">
      <EstudianteDashboard 
        misInscripciones={misInscripciones} 
        cancelarInscripcion={cancelar} 
        cursosDisponibles={cursosDisponibles} 
        inscribirCurso={inscribir} 
      />
    </VistaConSidebar>
  );
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
    {/* Contenedor global de notificaciones */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminVista />} />
        <Route path="/profesor" element={<ProfesorVista />} />
        <Route path="/estudiante" element={<EstudianteVista />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}