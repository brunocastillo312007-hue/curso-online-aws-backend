import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { SpeechService } from '../../services/speech.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  pestanaActiva: string = 'login'; // 'login', 'registro', 'verificar'

  credenciales = { correo: '', password: '' };
  nuevoUsuario = { cedula: '', nombre: '', correo: '', password: '', rol: 'ESTUDIANTE' };
  verificacionData = { correo: '', codigo: '' };

  errorMensaje: string = '';
  mensajeEstado: string = '';

  constructor(
    private apiService: ApiService, 
    private router: Router, 
    public speechService: SpeechService
  ) {}

  alternarVoz() {
    this.speechService.toggleVoz();
  }

  leerTexto(texto: string) {
    this.speechService.hablar(texto);
  }

  // Método para cambiar de pestaña con retroalimentación de voz
  cambiarPestana(pestana: string) {
    this.pestanaActiva = pestana;
    this.errorMensaje = '';
    this.mensajeEstado = '';

    if (pestana === 'registro') {
      this.speechService.hablar("Formulario de registro de usuario.");
    } else if (pestana === 'verificar') {
      this.speechService.hablar("Formulario de verificación de cuenta.");
    } else {
      this.speechService.hablar("Formulario de inicio de sesión.");
    }
  }

  onLogin() {
    this.speechService.hablar("Iniciando sesión, por favor espere.");
    this.errorMensaje = '';
    
    this.apiService.iniciarSesion(this.credenciales).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('rol', response.rol);
        localStorage.setItem('nombre', response.nombre);

        this.speechService.hablar("Inicio de sesión exitoso. Redirigiendo al panel correspondiente.");

        if (response.rol === 'ADMIN') this.router.navigate(['/admin']);
        else if (response.rol === 'PROFESOR') this.router.navigate(['/profesor']);
        else this.router.navigate(['/estudiante']);
      },
      error: () => {
        this.speechService.hablar("Correo o contraseña incorrectos.");
        this.errorMensaje = 'Correo o contraseña incorrectos.';
      }
    });
  }

  onRegistrar() {
    this.speechService.hablar("Procesando registro de usuario.");
    this.errorMensaje = '';
    
    // Mapeamos 'password' a 'contrasena' para que coincida con el backend
    const datosParaEnviar = {
      cedula: this.nuevoUsuario.cedula,
      nombre: this.nuevoUsuario.nombre,
      correo: this.nuevoUsuario.correo,
      contrasena: this.nuevoUsuario.password, 
      rol: this.nuevoUsuario.rol
    };

    this.apiService.registrarUsuario(datosParaEnviar).subscribe({
      next: () => {
        this.speechService.hablar("¡Registro exitoso! Por favor verifica tu cuenta.");
        this.mensajeEstado = '¡Registro exitoso! Por favor verifica tu cuenta.';
        this.pestanaActiva = 'verificar';
      },
      error: () => {
        this.speechService.hablar("No se pudo completar el registro. Verifica los datos.");
        this.errorMensaje = 'No se pudo completar el registro. Verifica los datos.';
      }
    });
  }

  onVerificar() {
    this.speechService.hablar("Verificando cuenta, por favor espere.");
    this.errorMensaje = '';
    
    this.apiService.verificarCuenta(this.verificacionData.correo, this.verificacionData.codigo).subscribe({
      next: () => {
        this.speechService.hablar("¡Cuenta verificada con éxito! Ya puedes iniciar sesión.");
        this.mensajeEstado = '¡Cuenta verificada con éxito! Ya puedes iniciar sesión.';
        this.pestanaActiva = 'login';
      },
      error: () => {
        this.speechService.hablar("Código o correo incorrectos.");
        this.errorMensaje = 'Código o correo incorrectos.';
      }
    });
  }
}