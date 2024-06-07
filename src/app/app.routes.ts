import { Routes } from '@angular/router';
import { HomeComponent } from "./features/home/home.component";
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { LayoutComponent } from './features/layout/layout.component';
import { authGuard } from './features/login/services/auth.guard';
import { AddNewPatientComponent } from './features/patient/add-new-patient/add-new-patient.component';
import { ListPatientsComponent } from './features/patient/list-patients/list-patients.component';
import { PredictionListPatientsComponent } from './features/cad-prediction/prediction-list-patients/prediction-list-patients.component';
import { PatientProfileComponent } from './features/patient/patient-profile/patient-profile.component';

export const routes: Routes = [
  //{path: 'home', component: HomeComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'add-new-patient',
        component: AddNewPatientComponent
      },
      {
        path: 'search-patients',
        component: ListPatientsComponent
      },
      {
        path: 'patient-profile/:id',
        component: PatientProfileComponent
      },
      {
        path: 'cad-prediction',
        component: PredictionListPatientsComponent
      }
    ]
  }
];
