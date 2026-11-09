import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profesor.html',
  styleUrls: ['./profesor.css']
})
export class ProfesorComponent implements OnInit {
  misCursosProf: any[] = [];
  misInscripciones: any[] = [];
  cargando: boolean = true;

  nuevoCurso = {
    titulo: '',
    nombre: '',
    descripcion: '',
    precio: 0
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarDatosProfesor();
  }

  cargarDatosProfesor() {
    this.cargando = true;
    
    this.apiService.obtenerMisCursosProfesor().subscribe({
      next: (res) => {
        this.misCursosProf = res;
      },
      error: (err) => console.error('Error al cargar cursos del profesor', err)
    });

    this.apiService.obtenerInscripcionesProfesor().subscribe({
      next: (res) => {
        this.misInscripciones = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar inscripciones', err);
        this.cargando = false;
      }
    });
  }

  registrarCurso(event: Event) {
    event.preventDefault();
    this.apiService.crearCurso(this.nuevoCurso).subscribe({
      next: () => {
        this.nuevoCurso = { titulo: '', nombre: '', descripcion: '', precio: 0 };
        this.cargarDatosProfesor();
      },
      error: (err) => console.error('Error al crear el curso', err)
    });
  }
}