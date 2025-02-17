import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IndicatorsComponent } from './pages/indicators/indicators.component';
import { IndicatorHistoryComponent } from './pages/indicator-history/indicator-history.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'indicators/:enterpriseId', component: IndicatorsComponent },
  { path: 'indicator-history/:_id', component: IndicatorHistoryComponent },
];
