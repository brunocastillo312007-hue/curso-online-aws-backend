import { Curso } from './curso.model';
import { Usuario } from './usuario.model';

export interface Inscripcion {
  id?: number;
  cursoId: number;
  estudianteId?: number;
  fechaInscripcion?: string;
  estado?: string;
  nombreCurso?: string; // Por si viene plano
  curso?: Curso;        // Objeto curso anidado que usa tu HTML
  estudiante?: Usuario; // Objeto estudiante anidado que usa tu HTML
}