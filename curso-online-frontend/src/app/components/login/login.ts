import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // 🟢 Propiedades requeridas por el HTML
  pestanaActiva: string = 'login'; // 'login', 'registro', 'verificar'
  
  credenciales = { correo: '', password: '' };
  nuevoUsuario: { 
    cedula: string; 
    nombre: string; 
    correo: string; 
    password: string; 
    rol: 'ESTUDIANTE' | 'ADMIN' | 'PROFESOR' 
  } = { 
    cedula: '', 
    nombre: '', 
    correo: '', 
    password: '', 
    rol: 'ESTUDIANTE' 
  };
  
  verificacionData = { correo: '', codigo: '' };
  
  errorMensaje: string = '';
  mensajeEstado: string = 'Sesión cerrada correctamente.';

  constructor(private apiService: ApiService, private router: Router) {}

  // 🟢 Métodos requeridos por el HTML
  onLogin() {
    this.apiService.iniciarSesion(this.credenciales).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('rol', response.rol);
        localStorage.setItem('nombre', response.nombre);

        if (response.rol === 'ADMIN') this.router.navigate(['/admin']);
        else if (response.rol === 'PROFESOR') this.router.navigate(['/profesor']);
        else this.router.navigate(['/estudiante']);
      },
      error: () => {
        this.errorMensaje = 'Credenciales incorrectas o cuenta pendiente de aprobación.';
      }
    });
  }

  onRegistrar() {
    this.apiService.registrarUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        this.mensajeEstado = '¡Registro exitoso! Revisa tu correo o verifica tu cuenta.';
        this.pestanaActiva = 'verificar';
      },
      error: () => {
        this.errorMensaje = 'No se pudo completar el registro.';
      }
    });
  }

  onVerificar() {
    this.apiService.verificarCuenta(this.verificacionData.correo, this.verificacionData.codigo).subscribe({
      next: () => {
        this.mensajeEstado = '¡Cuenta verificada con éxito! Ya puedes iniciar sesión.';
        this.pestanaActiva = 'login';
      },
      error: () => {
        this.errorMensaje = 'Código o correo incorrectos.';
      }
    });
  }
}