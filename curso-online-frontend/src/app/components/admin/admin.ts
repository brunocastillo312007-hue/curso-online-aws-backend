import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

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
  seccionActiva: string = 'usuarios'; // 'usuarios' o 'cursos'
  cargando: boolean = true;

  // Estados para la búsqueda en tiempo real
  busquedaUsuario: string = '';
  busquedaCurso: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarDatosAdmin();
  }

  cargarDatosAdmin() {
    this.cargando = true;
    
    // Cargar usuarios
    this.apiService.obtenerUsuariosAdmin().subscribe({
      next: (res) => {
        this.usuariosAdmin = res;
      },
      error: (err) => console.error('Error al cargar usuarios', err)
    });

    // Cargar catálogo de cursos
    this.apiService.obtenerCatalogoCursos().subscribe({
      next: (res) => {
        this.cursosDisponibles = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar cursos', err);
        this.cargando = false;
      }
    });
  }

  aprobarUsuario(id: number) {
    this.apiService.aprobarUsuarioAdmin(id).subscribe({
      next: () => this.cargarDatosAdmin(),
      error: (err) => console.error('Error al aprobar usuario', err)
    });
  }

  cambiarRol(id: number, event: any) {
    const nuevoRol = event.target.value;
    this.apiService.actualizarRolUsuario(id, nuevoRol).subscribe({
      next: () => this.cargarDatosAdmin(),
      error: (err) => console.error('Error al actualizar rol', err)
    });
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    this.apiService.eliminarUsuarioAdmin(id).subscribe({
      next: () => this.cargarDatosAdmin(),
      error: (err) => console.error('Error al eliminar usuario', err)
    });
  }

  eliminarCurso(idCurso: number) {
    if (!confirm('¿Estás seguro de eliminar este curso del sistema?')) return;
    this.apiService.eliminarCurso(idCurso).subscribe({
      next: () => this.cargarDatosAdmin(),
      error: (err) => console.error('Error al eliminar curso', err)
    });
  }

  // Getters para filtrado en tiempo real (Buscadores)
  get usuariosFiltrados() {
    return this.usuariosAdmin.filter(u => 
      u.nombre.toLowerCase().includes(this.busquedaUsuario.toLowerCase()) || 
      u.correo.toLowerCase().includes(this.busquedaUsuario.toLowerCase())
    );
  }

  get cursosFiltrados() {
    return this.cursosDisponibles.filter(c => 
      (c.nombre || c.titulo || '').toLowerCase().includes(this.busquedaCurso.toLowerCase()) || 
      (c.descripcion || '').toLowerCase().includes(this.busquedaCurso.toLowerCase())
    );
  }
}