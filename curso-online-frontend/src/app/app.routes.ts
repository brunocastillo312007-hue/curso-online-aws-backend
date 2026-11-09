import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin';
import { ProfesorComponent } from './components/profesor/profesor';
import { EstudianteComponent } from './components/estudiante/estudiante';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin', component: AdminComponent }, // Aquí aplicarías tu guard de ADMIN
  { path: 'profesor', component: ProfesorComponent },
  { path: 'estudiante', component: EstudianteComponent },
  { path: '**', redirectTo: '' }
];