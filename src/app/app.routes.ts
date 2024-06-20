import { Routes } from '@angular/router';
import { HomeComponent } from "./features/home/home.component";
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { LayoutComponent } from './features/layout/layout.component';
import { authGuard } from './features/login/services/auth.guard';
import { FormComponent } from './features/form/form.component';
import { AddNewPatientComponent } from './features/patient/add-new-patient/add-new-patient.component';
import { ListPatientsComponent } from './features/patient/list-patients/list-patients.component';
import { PredictionListPatientsComponent } from './features/cad-prediction/prediction-list-patients/prediction-list-patients.component';
import { PatientProfileComponent } from './features/patient/patient-profile/patient-profile.component';
import { DoctorComponent } from './features/doctor/doctor.component';
import { PredictionResultsComponent } from './features/cad-prediction/prediction-results/prediction-results.component';
import { ResultsReportComponent } from './features/cad-prediction/results-report/results-report.component';

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
        path: 'form',
        component: FormComponent
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
      },
      {
        path: 'profile',
        component: DoctorComponent
      },
      {
        path: 'prediction-results',
        component: PredictionResultsComponent
      }, 
      {
        path: 'report',
        component: ResultsReportComponent
      }
    ]
  }
];
