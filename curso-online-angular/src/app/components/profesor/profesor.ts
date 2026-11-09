import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { SpeechService } from '../../services/speech.service'; // <--- Importamos el servicio de voz

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profesor.html',
  styleUrls: ['./profesor.css']
})
export class ProfesorComponent implements OnInit {
  nombreProfesor: string = '';
  seccionActiva: string = 'mis-cursos'; // 'mis-cursos', 'crear-curso', 'inscripciones'
  
  misCursos: any[] = [];
  inscripcionesEstudiantes: any[] = [];
  cargando: boolean = true;

  // Objeto para el formulario de nuevo curso
  nuevoCurso = {
    titulo: '',
    descripcion: '',
    precio: 0
  };

  // Accesibilidad y tema
  tamanoLetra: string = 'normal';
  modoOscuro: boolean = false;

  constructor(
    private apiService: ApiService, 
    private router: Router,
    public speechService: SpeechService // <--- Declarado como public para usarlo en el HTML
  ) {}

  ngOnInit(): void {
    this.nombreProfesor = localStorage.getItem('nombre') || 'Profesor';
    this.speechService.hablar("Bienvenido al panel de profesor.");
    this.cargarDatosProfesor();
  }

  alternarVoz() {
    this.speechService.toggleVoz();
  }

  cambiarSeccion(seccion: string) {
    this.seccionActiva = seccion;
    if (seccion === 'mis-cursos') {
      this.speechService.hablar("Sección de gestión de tus cursos.");
    } else if (seccion === 'crear-curso') {
      this.speechService.hablar("Formulario para crear un nuevo curso.");
    } else if (seccion === 'inscripciones') {
      this.speechService.hablar("Sección de alumnos matriculados.");
    }
  }

  cargarDatosProfesor() {
    this.cargando = true;
    
    // Cargar los cursos del profesor / catálogo general según aplique
    this.apiService.obtenerCatalogoCursos().subscribe({
      next: (res: any) => {
        this.misCursos = res || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar cursos', err);
        this.speechService.hablar("Error al cargar tus cursos.");
        this.cargando = false;
      }
    });

    this.cargarInscripcionesAlumnos();
  }

  cargarInscripcionesAlumnos() {
    this.apiService.obtenerInscripcionesMisCursos().subscribe({
      next: (res: any) => {
        this.inscripcionesEstudiantes = res || [];
      },
      error: (err) => console.error('Error al cargar inscripciones de los alumnos', err)
    });
  }

  crearCurso() {
    if (!this.nuevoCurso.titulo || !this.nuevoCurso.descripcion) {
      this.speechService.hablar("Por favor completa los campos obligatorios del curso.");
      alert('Por favor completa los campos obligatorios del curso.');
      return;
    }

    this.speechService.hablar("Publicando nuevo curso, por favor espere.");
    this.apiService.crearCurso(this.nuevoCurso).subscribe({
      next: () => {
        this.speechService.hablar("¡Curso creado exitosamente!");
        alert('¡Curso creado exitosamente!');
        this.nuevoCurso = { titulo: '', descripcion: '', precio: 0 };
        this.seccionActiva = 'mis-cursos';
        this.cargarDatosProfesor();
      },
      error: (err) => {
        console.error('Error al crear curso', err);
        this.speechService.hablar("No se pudo crear el curso.");
        alert('No se pudo crear el curso.');
      }
    });
  }

  eliminarCurso(idCurso: number) {
    // 1. Activamos la voz primero
    this.speechService.hablar("¿Estás seguro de eliminar este curso?");

    // 2. Damos un pequeñísimo respiro (100 milisegundos) para que el audio empiece a reproducirse antes de la alerta
    setTimeout(() => {
      if (!confirm('¿Estás seguro de eliminar este curso?')) return;

      this.speechService.hablar("Eliminando curso.");
      this.apiService.eliminarCurso(idCurso).subscribe({
        next: () => {
          this.speechService.hablar("Curso eliminado correctamente.");
          this.cargarDatosProfesor(); // o cargarDatosAdmin() según el componente
        },
        error: (err) => {
          console.error('Error al eliminar curso', err);
          this.speechService.hablar("No se pudo eliminar el curso.");
        }
      });
    }, 100);
  }

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

  toggleTemaOscuro() {
    this.modoOscuro = !this.modoOscuro;
    if (this.modoOscuro) {
      this.speechService.hablar("Modo oscuro activado.");
    } else {
      this.speechService.hablar("Modo claro activado.");
    }
  }

  cerrarSesion() {
    this.speechService.hablar("Cerrando sesión. Hasta luego.");
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}