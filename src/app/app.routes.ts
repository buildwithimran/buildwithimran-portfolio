import { Routes } from '@angular/router';
import { PortfolioComponent } from './modules/portfolio/portfolio.component';

export const routes: Routes = [
  { path: '', component: PortfolioComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
