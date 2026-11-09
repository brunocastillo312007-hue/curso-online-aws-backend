import 'zone.js'; // <-- ¡Importa esto en la línea 1 obligatoriamente!
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));