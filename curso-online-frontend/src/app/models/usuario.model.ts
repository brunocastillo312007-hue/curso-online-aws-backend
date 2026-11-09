export interface Usuario {
  id?: number;
  cedula: string;
  nombre: string;
  correo: string;
  contrasena?: string;
  rol: 'ADMIN' | 'ESTUDIANTE' | 'PROFESOR';
  estado?: string;
  verificado?: boolean;
}

