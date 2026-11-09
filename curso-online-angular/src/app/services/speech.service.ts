import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private synth: SpeechSynthesis = window.speechSynthesis;
  private vozActiva: boolean = false; // Por defecto desactivado o según prefieras

  constructor() {
    // Recuperamos la preferencia guardada previamente (opcional)
    const estadoGuardado = localStorage.getItem('vozActiva');
    this.vozActiva = estadoGuardado === 'true';
  }

  // Alternar entre encendido y apagado
  toggleVoz(): boolean {
    this.vozActiva = !this.vozActiva;
    localStorage.setItem('vozActiva', String(this.vozActiva));
    
    if (!this.vozActiva) {
      this.detener();
    } else {
      this.hablar("Asistente de voz activado.");
    }
    return this.vozActiva;
  }

  isVozActiva(): boolean {
    return this.vozActiva;
  }

  hablar(texto: string) {
    if (!this.vozActiva || !this.synth || !texto) return;

    this.detener();

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    this.synth.speak(utterance);
  }

  detener() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
  }
}