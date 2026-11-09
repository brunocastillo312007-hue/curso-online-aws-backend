import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api';
import { SpeechService } from '../../services/speech.service'; // <--- Importamos el servicio de voz

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  usuariosAdmin: any[] = [];
  cursosDisponibles: any[] = [];
  seccionActiva: string = 'usuarios';
  cargando: boolean = true;
  busquedaUsuario: string = '';
  busquedaCurso: string = '';
  nombreAdmin: string = '';

  // Propiedades para el control de visualización
  tamanoLetra: string = 'normal'; // 'normal', 'grande', 'extra-grande'
  modoOscuro: boolean = false;

  constructor(
    private apiService: ApiService, 
    private router: Router,
    public speechService: SpeechService // <--- Declarado como public para usarlo en el HTML
  ) {}

  ngOnInit(): void {
    this.nombreAdmin = localStorage.getItem('nombre') || 'Administrador General';
    this.cargarDatosAdmin();
    this.speechService.hablar("Bienvenido al panel de administración.");
  }

  alternarVoz() {
    this.speechService.toggleVoz();
  }

  cambiarSeccion(seccion: string) {
    this.seccionActiva = seccion;
    if (seccion === 'usuarios') {
      this.speechService.hablar("Sección de gestión de usuarios.");
    } else {
      this.speechService.hablar("Sección de gestión de cursos.");
    }
  }

  cargarDatosAdmin() {
    this.cargando = true;

    forkJoin({
      usuarios: this.apiService.obtenerUsuariosAdmin(),
      cursos: this.apiService.obtenerCatalogoCursos()
    }).subscribe({
      next: (res: any) => {
        this.usuariosAdmin = res.usuarios || [];
        this.cursosDisponibles = res.cursos || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del panel', err);
        this.speechService.hablar("Error al cargar los datos del panel.");
        this.cargando = false;
      }
    });
  }

  contarUsuariosPorEstado(estado: string): number {
    return this.usuariosAdmin.filter(u => u.estado === estado).length;
  }

  cambiarRol(id: number, event: any) {
    const nuevoRol = event.target.value;
    this.speechService.hablar("Cambiando rol de usuario a " + nuevoRol);
    
    this.apiService.actualizarRolUsuario(id, nuevoRol).subscribe({
      next: (res) => {
        console.log('Rol actualizado con éxito:', res);
        this.speechService.hablar("Rol actualizado con éxito.");
        this.cargarDatosAdmin();
      },
      error: (err) => {
        console.error('Error al actualizar el rol:', err);
        this.speechService.hablar("No se pudo actualizar el rol del usuario.");
        alert('No se pudo actualizar el rol del usuario.');
      }
    });
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    this.speechService.hablar("Eliminando usuario.");
    this.apiService.eliminarUsuarioAdmin(id).subscribe({
      next: () => {
        this.speechService.hablar("Usuario eliminado correctamente.");
        this.cargarDatosAdmin();
      },
      error: (err) => {
        console.error('Error al eliminar usuario', err);
        this.speechService.hablar("Error al eliminar el usuario.");
      }
    });
  }

  eliminarCurso(idCurso: number) {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;
    
    this.speechService.hablar("Eliminando curso.");
    this.apiService.eliminarCurso(idCurso).subscribe({
      next: () => {
        this.speechService.hablar("Curso eliminado correctamente.");
        this.cargarDatosAdmin();
      },
      error: (err) => {
        console.error('Error al eliminar curso', err);
        this.speechService.hablar("Error al eliminar el curso.");
      }
    });
  }

  cerrarSesion() {
    this.speechService.hablar("Cerrando sesión. Hasta luego.");
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  get usuariosFiltrados() {
    return this.usuariosAdmin.filter(u => 
      (u.nombre || '').toLowerCase().includes(this.busquedaUsuario.toLowerCase()) || 
      (u.correo || '').toLowerCase().includes(this.busquedaUsuario.toLowerCase())
    );
  }

  get cursosFiltrados() {
    return this.cursosDisponibles.filter(c => 
      (c.nombre || c.titulo || '').toLowerCase().includes(this.busquedaCurso.toLowerCase())
    );
  }

  // Métodos para cambiar la tipografía
  cambiarTamanoTexto(tamano: string) {
    this.tamanoLetra = tamano;
    if (tamano === 'grande') {
      this.speechService.hablar("Tamaño de texto grande.");
    } else if (tamano === 'extra-grande') {
      this.speechService.hablar("Tamaño de texto extra grande.");
    } else {
      this.speechService.hablar("Tamaño de texto normal.");
    }
  }

  // Método para alternar el tema oscuro
    toggleTemaOscuro() {
      this.modoOscuro = !this.modoOscuro;
      this.speechService.hablar(this.modoOscuro ? "Modo claro activado." : "Modo oscuro activado.");
    }

  aprobarUsuario(id: number) {
    if (!confirm('¿Estás seguro de aprobar esta cuenta?')) return;
    
    this.speechService.hablar("Aprobando cuenta de usuario.");
    this.apiService.aprobarCuentaAdmin(id).subscribe({
      next: (res: any) => {
        this.speechService.hablar("¡Cuenta aprobada exitosamente!");
        alert(res.mensaje || '¡Cuenta aprobada exitosamente!');
        this.cargarDatosAdmin(); 
      },
      error: (err) => {
        console.error('Error al aprobar el usuario', err);
        this.speechService.hablar("No se pudo aprobar la cuenta.");
        alert('No se pudo aprobar la cuenta.');
      }
    });
  }
}