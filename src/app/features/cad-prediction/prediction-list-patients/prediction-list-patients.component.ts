import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { PatientService } from '../../patient/services/patient.service';

interface Patient {
  id: number;
  name: string;
}

@Component({
  selector: 'app-prediction-list-patients',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ListboxModule,
    ButtonModule],
  templateUrl: './prediction-list-patients.component.html',
  styleUrl: './prediction-list-patients.component.css'
})

export class PredictionListPatientsComponent implements OnInit {

  searchForm: FormGroup;
  patients: Patient[] = [];
  filteredPatients: Patient[] = this.patients;

  ngOnInit(): void {
    this.getPatients();
  }

  constructor(private fb: FormBuilder, private router: Router, private patientsService: PatientService) {
    this.searchForm = this.fb.group({
      searchQuery: [''],
      selectedPatient: [null]
    });

    this.searchForm.get('searchQuery')?.valueChanges.subscribe(query => {
      this.filterPatients(query);
    });
  }

  filterPatients(query: string) {
    this.filteredPatients = this.patients.filter(patient =>
      patient.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  getPatients() {
    const doctorId = localStorage.getItem('id');
    this.patientsService.getByDoctorId(doctorId).subscribe((response: any) => {
      if (response) {
        this.patients = response.map((item: any) => ({
          id: item.id,
          name: `${item.firstName} ${item.lastName}`
        }));
        this.filteredPatients = [...this.patients];
      }
    }, (error: any) => {
      console.error("Get failed", error);
    });

  }
}
