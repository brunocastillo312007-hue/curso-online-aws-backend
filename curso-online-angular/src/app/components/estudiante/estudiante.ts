import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { SpeechService } from '../../services/speech.service'; // <--- Importamos el servicio de voz

@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiante.html',
  styleUrls: ['./estudiante.css']
})
export class EstudianteComponent implements OnInit {
  nombreEstudiante: string = '';
  seccionActiva: string = 'catalogo'; 
  
  cursosDisponibles: any[] = [];
  misInscripciones: any[] = [];
  cargando: boolean = true;

  // Propiedades para accesibilidad y tema
  tamanoLetra: string = 'normal'; // 'normal', 'grande', 'extra-grande'
  modoOscuro: boolean = false;

  constructor(
    private apiService: ApiService, 
    private router: Router,
    public speechService: SpeechService // <--- Declarado como public para usarlo en el HTML
  ) {}

  ngOnInit(): void {
    this.nombreEstudiante = localStorage.getItem('nombre') || 'Estudiante';
    this.speechService.hablar("Bienvenido al panel de estudiante.");
    this.cargarDatosEstudiante();
  }

  alternarVoz() {
    this.speechService.toggleVoz();
  }

  cambiarSeccion(seccion: string) {
    this.seccionActiva = seccion;
    if (seccion === 'catalogo') {
      this.speechService.hablar("Catálogo de cursos disponibles.");
    } else {
      this.speechService.hablar("Sección de tus cursos inscritos.");
    }
  }

  cargarDatosEstudiante() {
    this.cargando = true;
    
    this.apiService.obtenerCatalogoCursos().subscribe({
      next: (res: any) => {
        this.cursosDisponibles = res || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar catálogo', err);
        this.speechService.hablar("Error al cargar el catálogo de cursos.");
        this.cargando = false;
      }
    });

    this.cargarMisInscripciones();
  }

  cargarMisInscripciones() {
    this.apiService.obtenerMisInscripciones().subscribe({
      next: (res: any) => {
        this.misInscripciones = res || [];
      },
      error: (err) => console.error('Error al cargar inscripciones', err)
    });
  }

  inscribir(cursoId: number) {
    const body = {
      curso: {
        id: cursoId
      }
    };

    this.speechService.hablar("Procesando inscripción al curso, por favor espere.");
    this.apiService.inscribirseCursoConBody(body).subscribe({
      next: () => {
        this.speechService.hablar("¡Inscripción realizada con éxito!");
        alert('¡Inscripción realizada con éxito!');
        this.cargarMisInscripciones();
      },
      error: (err) => {
        console.error('Error detallado al inscribirse:', err);
        this.speechService.hablar("No se pudo completar la inscripción.");
        alert('No se pudo completar la inscripción.');
      }
    });
  }

  borrarInscripcion(inscripcionId: number) {
    this.speechService.hablar("¿Estás seguro de cancelar esta inscripción?");
    
    setTimeout(() => {
      if (!confirm('¿Estás seguro de cancelar esta inscripción?')) return;
      
      this.speechService.hablar("Cancelando inscripción.");
      this.apiService.eliminarInscripcion(inscripcionId).subscribe({
        next: () => {
          this.speechService.hablar("Inscripción cancelada correctamente.");
          alert('Inscripción cancelada.');
          this.cargarMisInscripciones();
        },
        error: (err) => {
          console.error('Error al eliminar inscripción', err);
          this.speechService.hablar("No se pudo cancelar la inscripción.");
          alert('No se pudo cancelar la inscripción.');
        }
      });
    }, 100);
  }

  // Métodos para cambiar la tipografía y el tema
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