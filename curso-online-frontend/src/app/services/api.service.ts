import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, usuario);
  }

  verificarCuenta(correo: string, codigo: string): Observable<any> {
    // Cambiamos de /auth/verify a /usuarios/verificar
    return this.http.post(`${this.baseUrl}/usuarios/verificar`, { correo, codigo });
  }

  iniciarSesion(credenciales: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credenciales);
  }

  // NUEVO: Método para obtener la lista protegida de cursos o elementos de la BD
  obtenerCursos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/inscripciones/mis-inscripciones`);
  }

  // Método para que el profesor obtenga estrictamente sus cursos impartidos
  obtenerMisCursosProfesor(): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const tokenLimpio = token ? token.trim().replace(/\s+/g, '') : '';
    const headers = { 'Authorization': 'Bearer ' + tokenLimpio };

    return this.http.get(`${this.baseUrl}/cursos/mis-cursos`, { headers });
  }

  // Método para que el profesor vea las inscripciones de sus cursos
  obtenerInscripcionesProfesor(): Observable<any> {
    return this.http.get(`${this.baseUrl}/inscripciones/mis-cursos-inscripciones`);
  }

  crearInscripcion(idCurso: number): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const tokenLimpio = token ? token.trim().replace(/\s+/g, '') : '';

    const headers = {
      'Authorization': 'Bearer ' + tokenLimpio
    };

    // Estructura de objeto que el backend procesa correctamente en su Map
    const payload = {
      curso: {
        id: idCurso
      }
    };

    return this.http.post(`${this.baseUrl}/inscripciones`, payload, { headers });
  }

  obtenerCatalogoCursos(): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const tokenLimpio = token ? token.trim().replace(/\s+/g, '') : '';

    const headers = {
      'Authorization': 'Bearer ' + tokenLimpio
    };

    return this.http.get(`${this.baseUrl}/cursos`, { headers });
  }

  crearCurso(cursoData: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const tokenLimpio = token.trim();

    // Forzamos la unión en una sola línea continua sin saltos de texto
    const headers = {
      'Authorization': 'Bearer ' + tokenLimpio
    };

    return this.http.post(`${this.baseUrl}/cursos`, cursoData, { headers });
  }

  eliminarInscripcion(idInscripcion: number): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const tokenLimpio = token ? token.trim().replace(/\s+/g, '') : '';

    const headers = {
      'Authorization': 'Bearer ' + tokenLimpio
    };

    // Añadimos responseType: 'text' para que acepte la respuesta de texto plano de Java
    return this.http.delete(`${this.baseUrl}/inscripciones/${idInscripcion}`, { 
      headers, 
      responseType: 'text' 
    });
  }

  obtenerTodasLasInscripcionesAdmin(): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const tokenLimpio = token ? token.trim().replace(/\s+/g, '') : '';

    const headers = {
      'Authorization': 'Bearer ' + tokenLimpio
    };

    return this.http.get(`${this.baseUrl}/inscripciones`, { headers });
  }

  // Obtener lista completa de usuarios (para el Admin)
  obtenerUsuariosAdmin(): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const tokenLimpio = token ? token.trim().replace(/\s+/g, '') : '';
    const headers = { 'Authorization': 'Bearer ' + tokenLimpio };
    return this.http.get(`${this.baseUrl}/usuarios`, { headers });
  }

  // Cambiar el rol de un usuario (para el Admin)
  actualizarRolUsuario(idUsuario: number, nuevoRol: string): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const tokenLimpio = token ? token.trim().replace(/\s+/g, '') : '';
    const headers = { 'Authorization': 'Bearer ' + tokenLimpio };
    return this.http.put(`${this.baseUrl}/usuarios/${idUsuario}/rol?rol=${nuevoRol}`, {}, { headers });
  }

  eliminarCurso(idCurso: number): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const tokenLimpio = token ? token.trim().replace(/\s+/g, '') : '';

    const headers = {
      'Authorization': 'Bearer ' + tokenLimpio
    };

    return this.http.delete(`${this.baseUrl}/cursos/${idCurso}`, { 
      headers, 
      responseType: 'text' 
    });
  }

  eliminarUsuarioAdmin(idUsuario: number): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const tokenLimpio = token ? token.trim().replace(/\s+/g, '') : '';

    const headers = {
      'Authorization': 'Bearer ' + tokenLimpio
    };

    return this.http.delete(`${this.baseUrl}/usuarios/${idUsuario}`, { 
      headers, 
      responseType: 'text' 
    });
  }
  
  aprobarUsuarioAdmin(idUsuario: number): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const tokenLimpio = token ? token.trim().replace(/\s+/g, '') : '';
    const headers = { 'Authorization': 'Bearer ' + tokenLimpio };

    return this.http.put(`${this.baseUrl}/usuarios/${idUsuario}/aprobar`, {}, { 
      headers, 
      responseType: 'text' 
    });
  }

}