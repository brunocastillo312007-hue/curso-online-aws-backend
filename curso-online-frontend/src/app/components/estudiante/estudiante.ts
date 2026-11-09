import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estudiante.html',
  styleUrls: ['./estudiante.css']
})
export class EstudianteComponent implements OnInit {
  cursosDisponibles: any[] = [];
  misInscripciones: any[] = [];
  cargando: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarDatosEstudiante();
  }

  cargarDatosEstudiante() {
    this.cargando = true;

    this.apiService.obtenerCatalogoCursos().subscribe({
      next: (res) => {
        this.cursosDisponibles = res;
      },
      error: (err) => console.error('Error al cargar catálogo', err)
    });

    this.apiService.obtenerCursos().subscribe({
      next: (res) => {
        this.misInscripciones = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar inscripciones del estudiante', err);
        this.cargando = false;
      }
    });
  }

  inscribir(idCurso: number) {
    this.apiService.crearInscripcion(idCurso).subscribe({
      next: () => this.cargarDatosEstudiante(),
      error: (err) => console.error('Error al inscribirse', err)
    });
  }

  cancelarInscripcion(idInscripcion: number) {
    if (!confirm('¿Deseas cancelar tu matrícula en este curso?')) return;
    this.apiService.eliminarInscripcion(idInscripcion).subscribe({
      next: () => this.cargarDatosEstudiante(),
      error: (err) => console.error('Error al cancelar inscripción', err)
    });
  }

  // Método auxiliar para verificar si ya está inscrito
  estaInscrito(idCurso: number): boolean {
    return this.misInscripciones.some(ins => ins.curso?.id === idCurso);
  }
}