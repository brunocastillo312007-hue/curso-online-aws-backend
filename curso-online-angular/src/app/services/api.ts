import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // o '@angular/common/http' según tu proyecto
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Reemplaza esta URL con la URL pública de Tailscale Funnel que apunta a tu backend (ej. puerto 8443 o la ruta de tu servicio)
  private baseUrl = 'https://laptop-hj4guj0k.taile5d438.ts.net:8443/api';
  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // --- AUTENTICACIÓN ---
  iniciarSesion(credenciales: { correo: string; contrasena?: string; password?: string }): Observable<any> {
    const payload = {
      correo: credenciales.correo,
      contrasena: credenciales.contrasena || credenciales.password
    };
    return this.http.post(`${this.baseUrl}/auth/login`, payload);
  }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, usuario);
  }

  verificarCuenta(correo: string, codigo: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/verificar`, { correo, codigo });
  }

  // --- ADMINISTRADOR Y CURSOS ---
  obtenerUsuariosAdmin(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/usuarios`, this.getAuthHeaders());
  }

  aprobarCuentaAdmin(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/usuarios/${id}/aprobar`, {}, { headers });
  }

  verificarUsuarioAdmin(id: number, verificado: boolean = true): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/usuarios/${id}/verificar`, { verificado }, this.getAuthHeaders());
  }

  actualizarRolUsuario(id: number, rol: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/usuarios/${id}/rol`, { rol }, this.getAuthHeaders());
  }

  eliminarUsuarioAdmin(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/usuarios/${id}`, this.getAuthHeaders());
  }

  obtenerCatalogoCursos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cursos`, this.getAuthHeaders());
  }

  inscribirseCursoConBody(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/inscripciones`, body, { headers });
  }

  eliminarCurso(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cursos/${id}`, this.getAuthHeaders());
  }
  
  obtenerPerfilEstudiante(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/usuarios/perfil`, { headers });
  }

  inscribirseCurso(cursoId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/inscripciones`, { cursoId }, { headers });
  }

  obtenerMisInscripciones(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/inscripciones/mis-inscripciones`, { headers });
  }

  eliminarInscripcion(inscripcionId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/inscripciones/${inscripcionId}`, { headers });
  }

  crearCurso(cursoData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/cursos`, cursoData, { headers });
  }

  obtenerInscripcionesMisCursos(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/inscripciones/mis-cursos-inscripciones`, { headers });
  }
}