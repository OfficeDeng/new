import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { TableComponent } from './pages/table/table.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'table', component: TableComponent },
  { path: '**', redirectTo: '' }
]; 