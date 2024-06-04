import { Routes } from '@angular/router';
import {HomeComponent} from "./features/home/home.component";
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { LayoutComponent } from './features/layout/layout.component';
import { authGuard } from './features/login/services/auth.guard';
import { AddNewPatientComponent } from './features/add-new-patient/add-new-patient.component';

export const routes: Routes = [
  //{path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard]
      },
      {
        path: 'add-new-patient',
        component: AddNewPatientComponent,
        canActivate: [authGuard]
      }
    ]
  }
];
