import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { Usuario } from './models/usuario.model';
import { Inscripcion } from './models/inscripcion.model';
import { Curso } from './models/curso.model';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5" style="max-width: 900px;">
      
      <!-- ENCABEZADO PRINCIPAL -->
      <div class="text-center mb-4">
        <h1 class="fw-bold text-primary">🎓 CursoOnline</h1>
        <p class="text-muted">Plataforma de gestión educativa y académica</p>
      </div>
      
      <!-- VISTA 1: Si NO ha iniciado sesión -->
      <div *ngIf="!estaAutenticado" class="card shadow border-0" style="max-width: 600px; margin: auto;">
        
        <div class="card-header bg-white pt-3 pb-0 border-bottom-0">
          <ul class="nav nav-tabs card-header-tabs justify-content-center">
            <li class="nav-item">
              <button class="nav-link" [class.active]="modoAuth === 'login'" (click)="modoAuth = 'login'; mensajeRespuesta = ''">
                🔐 Iniciar Sesión
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" [class.active]="modoAuth === 'registro'" (click)="modoAuth = 'registro'; mensajeRespuesta = ''">
                📝 Registrarse
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" [class.active]="modoAuth === 'verificar'" (click)="modoAuth = 'verificar'; mensajeRespuesta = ''">
                ✉️ Verificar Cuenta
              </button>
            </li>
          </ul>
        </div>

        <div class="card-body p-4">
          
          <!-- INICIAR SESIÓN -->
          <div *ngIf="modoAuth === 'login'">
            <h3 class="h5 text-dark mb-3 text-center">Bienvenido de nuevo</h3>
            <div class="mb-3">
              <input [(ngModel)]="credencialesLogin.correo" placeholder="Correo electrónico" class="form-control" />
            </div>
            <div class="mb-3">
              <input [(ngModel)]="credencialesLogin.contrasena" type="password" placeholder="Contraseña" class="form-control" />
            </div>
            <button (click)="login()" class="btn btn-warning w-100 fw-bold py-2">Iniciar Sesión</button>
            <div class="text-center mt-3">
              <small class="text-muted">¿No tienes cuenta? <a href="#" (click)="$event.preventDefault(); modoAuth = 'registro'" class="text-primary text-decoration-none">Regístrate aquí</a></small>
            </div>
          </div>

          <!-- REGISTRO -->
          <div *ngIf="modoAuth === 'registro'">
            <h3 class="h5 text-primary mb-3 text-center">Crea tu cuenta nueva</h3>
            <div class="mb-3"><input [(ngModel)]="usuario.cedula" placeholder="Cédula (10 dígitos)" class="form-control" /></div>
            <div class="mb-3"><input [(ngModel)]="usuario.nombre" placeholder="Nombre completo" class="form-control" /></div>
            <div class="mb-3"><input [(ngModel)]="usuario.correo" placeholder="Correo electrónico" class="form-control" /></div>
            <div class="mb-3"><input [(ngModel)]="usuario.contrasena" type="password" placeholder="Contraseña" class="form-control" /></div>
            <div class="mb-3">
              <select [(ngModel)]="usuario.rol" class="form-select">
                <option value="ESTUDIANTE">ESTUDIANTE</option>
                <option value="PROFESOR">PROFESOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <button (click)="registrar()" class="btn btn-primary w-100 py-2">Registrarse y Enviar Código</button>
            <div class="text-center mt-3">
              <small class="text-muted">¿Ya tienes tu código? <a href="#" (click)="$event.preventDefault(); modoAuth = 'verificar'" class="text-success text-decoration-none">Verifica tu cuenta</a></small>
            </div>
          </div>

          <!-- VERIFICAR -->
          <div *ngIf="modoAuth === 'verificar'">
            <h3 class="h5 text-success mb-3 text-center">Verificación de Correo</h3>
            <div class="mb-3"><input [(ngModel)]="correoVerificacion" placeholder="Tu correo electrónico" class="form-control" /></div>
            <div class="mb-3"><input [(ngModel)]="codigoVerificacion" placeholder="Código de 6 dígitos" class="form-control text-center fs-5" /></div>
            <button (click)="verificar()" class="btn btn-success w-100 py-2">Verificar Cuenta</button>
            <div class="text-center mt-3">
              <small class="text-muted"><a href="#" (click)="$event.preventDefault(); modoAuth = 'login'" class="text-warning text-decoration-none fw-bold">Inicia sesión</a></small>
            </div>
          </div>

        </div>
      </div>

      <!-- VISTA 2: PANEL PRINCIPAL (SI HA INICIADO SESIÓN) -->
      <div *ngIf="estaAutenticado" class="card shadow border-0">
        <div class="card-header bg-success text-white d-flex justify-content-between align-items-center py-3">
          <div>
            <h4 class="mb-0">Panel Principal - CursoOnline</h4>
            <small>Bienvenido, <strong>{{ nombreUsuario }}</strong> (Rol: <span class="badge bg-light text-dark">{{ rolUsuario }}</span>)</small>
          </div>
          <button (click)="cerrarSesion()" class="btn btn-outline-light btn-sm fw-bold">Cerrar Sesión</button>
        </div>

        <div class="card-body p-4">
          
          <!-- ================= ESTUDIANTE ================= -->
          <div *ngIf="rolUsuario === 'ESTUDIANTE'">
            <h3 class="h5 text-secondary mb-3">📚 Mis Cursos Matriculados</h3>
            <div *ngIf="cursosMatriculados.length > 0; else sinMatriculas" class="row row-cols-1 row-cols-md-2 g-3 mb-4">
              <div *ngFor="let item of cursosMatriculados" class="col">
                <div class="card h-100 border-success shadow-sm">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 class="card-title text-success">{{ item.curso?.nombre || item.curso?.titulo || 'Curso sin nombre' }}</h5>
                      <p class="card-text text-muted small">{{ item.curso?.descripcion || 'Sin descripción' }}</p>
                    </div>
                    <button (click)="eliminarInscripcion(item.id)" class="btn btn-outline-danger btn-sm mt-3">Cancelar Matrícula</button>
                  </div>
                </div>
              </div>
            </div>
            <ng-template #sinMatriculas><p class="text-muted fst-italic">No estás inscrito en ningún curso actualmente.</p></ng-template>

            <hr class="my-4">

            <h3 class="h5 text-secondary mb-3">🔍 Catálogo de Cursos Disponibles</h3>
            <div *ngIf="cursosDisponibles.length > 0; else sinDisponibles" class="row row-cols-1 row-cols-md-2 g-3">
              <div *ngFor="let curso of cursosDisponibles" class="col">
                <div class="card h-100 shadow-sm">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 class="card-title text-primary">{{ curso.nombre || curso.titulo }}</h5>
                      <p class="card-text text-muted small">{{ curso.descripcion }}</p>
                      <span class="badge bg-secondary mb-2" *ngIf="curso.precio">Precio: $ {{ curso.precio }}</span>
                    </div>
                    <button (click)="inscribirseEnCurso(curso.id)" class="btn btn-success btn-sm mt-2">Inscribirse</button>
                  </div>
                </div>
              </div>
            </div>
            <ng-template #sinDisponibles><p class="text-muted fst-italic">No hay cursos disponibles.</p></ng-template>
          </div>

          <!-- ================= PROFESOR ================= -->
          <div *ngIf="rolUsuario === 'PROFESOR'">
            
            <!-- Formulario para crear curso -->
            <div class="card bg-light border-0 p-4 mb-4">
              <h3 class="h5 text-primary mb-3">➕ Crear Nuevo Curso</h3>
              <div class="row g-3">
                <div class="col-md-6"><input [(ngModel)]="nuevoCurso.titulo" placeholder="Título del curso" class="form-control" /></div>
                <div class="col-md-6"><input [(ngModel)]="nuevoCurso.nombre" placeholder="Nombre del curso" class="form-control" /></div>
                <div class="col-12"><input [(ngModel)]="nuevoCurso.descripcion" placeholder="Descripción del curso" class="form-control" /></div>
                <div class="col-md-6"><input [(ngModel)]="nuevoCurso.precio" type="number" placeholder="Precio del curso" class="form-control" /></div>
                <div class="col-md-6 d-flex align-items-end"><button (click)="crearCurso()" class="btn btn-primary w-100">Guardar Curso</button></div>
              </div>
            </div>

            <!-- Mis Cursos Creados -->
            <h3 class="h5 text-secondary mb-3">📚 Mis Cursos Impartidos</h3>
            <div *ngIf="cursosProfesor.length > 0; else sinCursosProf" class="row row-cols-1 row-cols-md-2 g-3 mb-4">
              <div *ngFor="let curso of cursosProfesor" class="col">
                <div class="card h-100 border-primary shadow-sm">
                  <div class="card-body">
                    <h5 class="card-title text-primary">{{ curso.nombre || curso.titulo }}</h5>
                    <p class="card-text text-muted small">{{ curso.descripcion }}</p>
                    <span class="badge bg-secondary">Precio: $ {{ curso.precio }}</span>
                  </div>
                </div>
              </div>
            </div>
            <ng-template #sinCursosProf><p class="text-muted fst-italic">Aún no hay cursos registrados.</p></ng-template>

            <hr class="my-4">

            <!-- Estudiantes Inscritos -->
            <h3 class="h5 text-secondary mb-3">👥 Estudiantes Inscritos en Mis Cursos</h3>
            <div *ngIf="cursosMatriculados.length > 0; else sinProfesor" class="table-responsive">
              <table class="table table-striped table-hover align-middle">
                <thead class="table-success">
                  <tr><th>Curso</th><th>Estudiante</th><th>Correo</th></tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of cursosMatriculados">
                    <td><strong>{{ item.curso?.nombre || item.curso?.titulo || item.nombreCurso || 'Sin nombre' }}</strong></td>
                    <td>{{ item.estudiante?.nombre || 'Estudiante' }}</td>
                    <td><span class="text-muted">{{ item.estudiante?.correo }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ng-template #sinProfesor><p class="text-muted fst-italic">No hay estudiantes inscritos en tus cursos todavía.</p></ng-template>
          </div>

          <!-- ================= ADMIN (CON PESTAÑAS) ================= -->
          <div *ngIf="rolUsuario === 'ADMIN'">
            
            <!-- Pestañas del Admin -->
            <ul class="nav nav-pills mb-4 bg-light p-2 rounded">
              <li class="nav-item">
                <button class="nav-link" [class.active]="tabAdmin === 'usuarios'" (click)="tabAdmin = 'usuarios'; cargarDatosAdmin()">
                  👤 Gestión de Usuarios
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" [class.active]="tabAdmin === 'cursos'" (click)="tabAdmin = 'cursos'; cargarDatosAdmin()">
                  📚 Catálogo de Cursos
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" [class.active]="tabAdmin === 'inscripciones'" (click)="tabAdmin = 'inscripciones'; cargarDatosAdmin()">
                  📝 Todas las Inscripciones
                </button>
              </li>
            </ul>

            <!-- Sub-vista 1: Usuarios, Estados y Aprobación -->
            <div *ngIf="tabAdmin === 'usuarios'">
              <h3 class="h5 text-dark mb-3">Usuarios Registrados en el Sistema</h3>
              <div class="table-responsive">
                <table class="table table-bordered table-hover align-middle">
                  <thead class="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol Actual</th>
                      <th>Estado</th>
                      <th>Cambiar Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let u of listaUsuariosAdmin">
                      <td>#{{ u.id }}</td>
                      <td>{{ u.nombre }}</td>
                      <td>{{ u.correo }}</td>
                      <td><span class="badge bg-info text-dark">{{ u.rol }}</span></td>
                      <td>
                        <span class="badge" [class.bg-success]="u.estado === 'APROBADA'" [class.bg-warning]="u.estado !== 'APROBADA'">
                          {{ u.estado || 'PENDIENTE' }}
                        </span>
                      </td>
                      <td>
                        <select #selectRol (change)="cambiarRol(u.id, selectRol.value)" class="form-select form-select-sm" style="width: 140px; display: inline-block;">
                          <option value="" disabled selected>Seleccionar...</option>
                          <option value="ESTUDIANTE">ESTUDIANTE</option>
                          <option value="PROFESOR">PROFESOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td>
                        <!-- Botón para aprobar si la cuenta no está aprobada -->
                        <button *ngIf="u.estado !== 'APROBADA'" (click)="aprobarUsuario(u.id)" class="btn btn-success btn-sm me-1">Aprobar</button>
                        <button (click)="eliminarUsuario(u.id)" class="btn btn-outline-danger btn-sm">Eliminar</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Sub-vista 2: Cursos (Con botón para que el Admin pueda borrarlos) -->
            <div *ngIf="tabAdmin === 'cursos'">
              <h3 class="h5 text-dark mb-3">Todos los Cursos Creados</h3>
              <div class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                  <thead class="table-dark">
                    <tr><th>ID</th><th>Título / Nombre</th><th>Descripción</th><th>Precio</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let c of cursosDisponibles">
                      <td>#{{ c.id }}</td>
                      <td><strong>{{ c.nombre || c.titulo }}</strong></td>
                      <td>{{ c.descripcion }}</td>
                      <td>$ {{ c.precio }}</td>
                      <td>
                        <button (click)="eliminarCursoAdmin(c.id)" class="btn btn-outline-danger btn-sm">Eliminar Curso</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Sub-vista 3: Inscripciones (Con botón para cancelar cualquier matrícula) -->
            <div *ngIf="tabAdmin === 'inscripciones'">
              <h3 class="h5 text-dark mb-3">Inscripciones Globales</h3>
              <div class="table-responsive">
                <table class="table table-bordered table-hover align-middle">
                  <thead class="table-dark">
                    <tr><th>ID Inscripción</th><th>Estudiante</th><th>Correo</th><th>Curso</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of cursosMatriculados">
                      <td><span class="badge bg-secondary">#{{ item.id }}</span></td>
                      <td>{{ item.estudiante?.nombre || 'N/A' }}</td>
                      <td>{{ item.estudiante?.correo }}</td>
                      <td><strong>{{ item.curso?.nombre || item.curso?.titulo || 'N/A' }}</strong></td>
                      <td>
                        <button (click)="eliminarInscripcion(item.id)" class="btn btn-outline-danger btn-sm">Cancelar Matrícula</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- Mensajes del sistema -->
      <div *ngIf="mensajeRespuesta" class="alert alert-info mt-3 shadow-sm text-center" role="alert">
        {{ mensajeRespuesta }}
      </div>
    </div>
  `
})
export class App {
  modoAuth: string = 'login';
  tabAdmin: string = 'usuarios';

  usuario: Usuario = { cedula: '', nombre: '', correo: '', contrasena: '', rol: 'ESTUDIANTE' };
  correoVerificacion: string = '';
  codigoVerificacion: string = '';
  credencialesLogin = { correo: '', contrasena: '' };
  nuevoCurso = { titulo: '', nombre: '', descripcion: '', precio: 0 };

  estaAutenticado: boolean = false;
  nombreUsuario: string = '';
  rolUsuario: string = '';
  mensajeRespuesta: string = '';
  
  cursosMatriculados: Inscripcion[] = [];
  cursosDisponibles: Curso[] = [];
  listaUsuariosAdmin: any[] = [];
  cursosProfesor: Curso[] = [];


  constructor(private apiService: ApiService) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.estaAutenticado = true;
        this.nombreUsuario = localStorage.getItem('nombre') || 'Usuario';
        this.rolUsuario = localStorage.getItem('rol') || 'ESTUDIANTE';
        this.cargarDatosSegunRol();
      }
    }
  }

  registrar() {
    this.apiService.registrarUsuario(this.usuario).subscribe({
      next: (res: any) => {
        this.mensajeRespuesta = '¡Registro exitoso! Revisa tu correo e introduce el código en Verificar Cuenta.';
        this.correoVerificacion = this.usuario.correo;
        this.modoAuth = 'verificar';
      },
      error: (err) => this.mensajeRespuesta = 'Error en el registro: ' + (err.error?.error || 'Verifica los datos')
    });
  }

  verificar() {
    this.apiService.verificarCuenta(this.correoVerificacion, this.codigoVerificacion).subscribe({
      next: (res: any) => {
        this.mensajeRespuesta = '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.';
        this.modoAuth = 'login';
      },
      error: (err) => this.mensajeRespuesta = 'Error al verificar: Código incorrecto o expirado.'
    });
  }

  login() {
    this.apiService.iniciarSesion(this.credencialesLogin).subscribe({
      next: (res: any) => {
        const token = res.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('nombre', res.nombre || 'Estudiante');
          localStorage.setItem('rol', res.rol || 'ESTUDIANTE');
        }
        this.nombreUsuario = res.nombre || 'Estudiante';
        this.rolUsuario = res.rol || 'ESTUDIANTE';
        this.estaAutenticado = true;
        this.mensajeRespuesta = '';
        this.cargarDatosSegunRol();
      },
      error: (err) => this.mensajeRespuesta = 'Error al iniciar sesión: ' + (err.error?.error || 'Credenciales incorrectas')
    });
  }

  cargarDatosSegunRol() {
    if (this.rolUsuario === 'ADMIN') {
      this.cargarDatosAdmin();
    } else if (this.rolUsuario === 'PROFESOR') { 
      this.apiService.obtenerInscripcionesProfesor().subscribe({
        next: (data: any) => { this.cursosMatriculados = [...data]; },
        error: (err) => { console.error('Error al cargar inscripciones del profesor:', err); }
      });

      this.apiService.obtenerCatalogoCursos().subscribe({
        next: (data: Curso[]) => { this.cursosDisponibles = [...data]; },
        error: (err) => { console.error('Error al cargar catálogo:', err); }
      });

      this.apiService.obtenerMisCursosProfesor().subscribe({
        next: (data: Curso[]) => { this.cursosProfesor = [...data]; },
        error: (err) => { console.error('Error al cargar mis cursos:', err); }
      });

    } else {
      this.apiService.obtenerCursos().subscribe({
        next: (data: any) => { this.cursosMatriculados = [...data]; },
        error: (err) => { console.error('Error al cargar cursos del estudiante:', err); }
      });
      this.apiService.obtenerCatalogoCursos().subscribe({
        next: (data: any) => { this.cursosDisponibles = [...data]; },
        error: (err) => { console.error('Error al cargar catálogo de cursos:', err); }
      });
    }
  }

  cargarDatosAdmin() {
    if (this.tabAdmin === 'usuarios') {
      this.apiService.obtenerUsuariosAdmin().subscribe({
        next: (data: any) => { this.listaUsuariosAdmin = [...data]; },
        error: (err) => { console.error('Error al obtener usuarios:', err); }
      });
    } else if (this.tabAdmin === 'cursos') {
      this.apiService.obtenerCatalogoCursos().subscribe({
        next: (data: any) => { this.cursosDisponibles = [...data]; },
        error: (err) => { console.error('Error al obtener cursos:', err); }
      });
    } else if (this.tabAdmin === 'inscripciones') {
      this.apiService.obtenerTodasLasInscripcionesAdmin().subscribe({
        next: (data: any) => { this.cursosMatriculados = [...data]; },
        error: (err) => { console.error('Error al obtener inscripciones globales:', err); }
      });
    }
  }

  cambiarRol(idUsuario?: number, nuevoRol?: string) {
    if (!idUsuario || !nuevoRol) return;
    this.apiService.actualizarRolUsuario(idUsuario, nuevoRol).subscribe({
      next: (res: any) => {
        this.mensajeRespuesta = `¡Rol actualizado exitosamente a ${nuevoRol}!`;
        this.cargarDatosAdmin();
      },
      error: (err) => {
        this.mensajeRespuesta = 'Error al cambiar el rol: ' + (err.error?.error || 'No se pudo actualizar');
      }
    });
  }

  eliminarUsuario(idUsuario?: number) {
    if (!idUsuario) return;
    if (confirm('¿Estás seguro de que deseas eliminar este usuario del sistema?')) {
      this.apiService.eliminarUsuarioAdmin(idUsuario).subscribe({
        next: (res: any) => {
          this.mensajeRespuesta = '¡Usuario eliminado exitosamente!';
          this.cargarDatosAdmin();
        },
        error: (err) => {
          this.mensajeRespuesta = 'Error al eliminar usuario: ' + (err.error?.error || 'No se pudo eliminar');
        }
      });
    }
  }

  eliminarCursoAdmin(idCurso?: number) {
    if (!idCurso) return;
    this.apiService.eliminarCurso(idCurso).subscribe({
      next: (res: any) => {
        this.mensajeRespuesta = '¡Curso eliminado exitosamente!';
        this.cargarDatosAdmin();
      },
      error: (err) => {
        this.mensajeRespuesta = 'Error al eliminar curso: ' + (err.error?.error || 'No se pudo eliminar');
      }
    });
  }

  inscribirseEnCurso(idCurso?: number) {
    if (!idCurso) return;
    this.apiService.crearInscripcion(idCurso).subscribe({
      next: (res: any) => {
        this.mensajeRespuesta = '¡Inscripción realizada con éxito!';
        this.cargarDatosSegunRol();
      },
      error: (err) => {
        this.mensajeRespuesta = 'Error al inscribirse: ' + (err.error?.error || 'Ya estás inscrito');
      }
    });
  }

  eliminarInscripcion(idInscripcion?: number) {
    if (!idInscripcion) return;
    this.apiService.eliminarInscripcion(idInscripcion).subscribe({
      next: (res: any) => {
        this.mensajeRespuesta = '¡Matrícula cancelada con éxito!';
        this.cargarDatosSegunRol();
        if (this.rolUsuario === 'ADMIN') {
          this.cargarDatosAdmin();
        }
      },
      error: (err) => {
        this.mensajeRespuesta = 'Error al cancelar la matrícula: ' + (err.error?.error || 'No se pudo eliminar');
      }
    });
  }

  crearCurso() {
    if (!this.nuevoCurso.titulo || !this.nuevoCurso.precio) {
      this.mensajeRespuesta = 'Por favor ingresa al menos el título y el precio del curso.';
      return;
    }
    const payload = {
      titulo: this.nuevoCurso.titulo,
      nombre: this.nuevoCurso.nombre ? this.nuevoCurso.nombre : this.nuevoCurso.titulo,
      descripcion: this.nuevoCurso.descripcion,
      precio: this.nuevoCurso.precio
    };
    this.apiService.crearCurso(payload).subscribe({
      next: (res: any) => {
        this.mensajeRespuesta = '¡Curso creado exitosamente!';
        this.nuevoCurso = { titulo: '', nombre: '', descripcion: '', precio: 0 };
        this.cargarDatosSegunRol();
      },
      error: (err) => {
        this.mensajeRespuesta = 'Error al crear curso: ' + (err.error?.error || 'Verifica los datos');
      }
    });
  }

  aprobarUsuario(idUsuario?: number) {
    if (!idUsuario) return;
    this.apiService.aprobarUsuarioAdmin(idUsuario).subscribe({
      next: (res: any) => {
        this.mensajeRespuesta = '¡Cuenta de usuario aprobada con éxito!';
        this.cargarDatosAdmin(); // Refrescar la tabla
      },
      error: (err) => {
        this.mensajeRespuesta = 'Error al aprobar la cuenta: ' + (err.error?.error || 'No se pudo procesar');
      }
    });
  }

  cerrarSesion() {
    if (typeof window !== 'undefined') { localStorage.clear(); }
    this.estaAutenticado = false;
    this.cursosMatriculados = [];
    this.cursosDisponibles = [];
    this.listaUsuariosAdmin = [];
    this.mensajeRespuesta = 'Sesión cerrada correctamente.';
    this.modoAuth = 'login';
  }
}