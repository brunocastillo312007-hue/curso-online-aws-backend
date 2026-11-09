import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { AdminComponent } from './components/admin/admin';
import { ProfesorComponent } from './components/profesor/profesor';
import { EstudianteComponent } from './components/estudiante/estudiante';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'profesor', component: ProfesorComponent },
  { path: 'estudiante', component: EstudianteComponent },
  { path: '**', redirectTo: '' }
];