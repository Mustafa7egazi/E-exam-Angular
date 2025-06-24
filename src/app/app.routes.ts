import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/notfound/notfound';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },

  { path: '**', component: NotFound },
];
