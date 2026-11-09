import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log("TOKEN ACTUAL EN LOCALSTORAGE:", token);
  return {
    headers: {
      'Authorization': token ? `Bearer ${token.trim()}` : ''
    }
  };
};

export const apiService = {
  registrarUsuario: (data) => axios.post(`${API_URL}/usuarios`, data),
  verificarCuenta: (data) => axios.post(`${API_URL}/usuarios/verificar`, data),
  iniciarSesion: (data) => axios.post(`${API_URL}/auth/login`, data),
  
  obtenerCursosEstudiante: () => axios.get(`${API_URL}/inscripciones/mis-inscripciones`, getAuthHeaders()),
  obtenerCatalogoCursos: () => axios.get(`${API_URL}/cursos`, getAuthHeaders()),
  inscribirseCurso: (idCurso) => axios.post(`${API_URL}/inscripciones`, { curso: { id: idCurso } }, getAuthHeaders()),
  eliminarInscripcion: (idInscripcion) => axios.delete(`${API_URL}/inscripciones/${idInscripcion}`, { ...getAuthHeaders(), responseType: 'text' }),

  obtenerMisCursosProfesor: () => axios.get(`${API_URL}/cursos/mis-cursos`, getAuthHeaders()),
  obtenerInscripcionesProfesor: () => axios.get(`${API_URL}/inscripciones/mis-cursos-inscripciones`, getAuthHeaders()),
  crearCurso: (cursoData) => axios.post(`${API_URL}/cursos`, cursoData, getAuthHeaders()),

  obtenerUsuariosAdmin: () => axios.get(`${API_URL}/usuarios`, getAuthHeaders()),
  actualizarRolUsuario: (id, rol) => axios.put(`${API_URL}/usuarios/${id}/rol?rol=${rol}`, {}, getAuthHeaders()),
  aprobarUsuario: (id) => axios.put(`${API_URL}/usuarios/${id}/aprobar`, {}, getAuthHeaders()),
  eliminarUsuarioAdmin: (id) => axios.delete(`${API_URL}/usuarios/${id}`, { ...getAuthHeaders(), responseType: 'text' }),
  eliminarCursoAdmin: (id) => axios.delete(`${API_URL}/cursos/${id}`, { ...getAuthHeaders(), responseType: 'text' }),
};