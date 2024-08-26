import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  dni: string;
  latestResult: number;
}

interface Genre {
  name: string;
  code: string;
}

@Component({
  selector: 'app-list-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, AvatarModule, ToolbarModule, DropdownModule, FieldsetModule],
  templateUrl: './list-patients.component.html',
  styleUrl: './list-patients.component.css'
})
export class ListPatientsComponent implements OnInit {

  patients: Patient[] = [];
  filteredPatients: Patient[] = [...this.patients];
  searchForm: FormGroup;
  genders: Genre[] | undefined;

  constructor(private fb: FormBuilder, private router: Router, private patientService: PatientService) {
    this.searchForm = this.fb.group({
      selectedName: [''],
      selectedGenre: [''],
      selectedAge: [''],
      selectedCADPercent: ['']
    });
  }

  ngOnInit(): void {
    this.genders = [
      { name: 'Female', code: 'F' },
      { name: 'Male', code: 'M' }
    ];

    this.searchForm.valueChanges.subscribe(values => {
      this.filterPatients(values);
    });
    this.getPatients();
  }

  filterPatients(values: any): void {
    const { selectedName, selectedGenre, selectedAge, selectedCADPercent } = values;

    this.filteredPatients = this.patients.filter(patient => {
      const matchesName = selectedName ? patient.name.toLowerCase().includes(selectedName.toLowerCase()) : true;
      const matchesGender = selectedGenre ? patient.gender === selectedGenre.name : true;
      const matchesAge = selectedAge ? patient.age.toString().includes(selectedAge) : true;
      const matchesCADPercent = selectedCADPercent ? patient.latestResult.toString().includes(selectedCADPercent) : true;

      return matchesName && matchesGender && matchesAge && matchesCADPercent;
    });
  }

  getPatients() {
    const doctorId = localStorage.getItem('id');
    this.patientService.getByDoctorId(doctorId).subscribe((response: any) => {
      if (response) {
        const patientPromises = response.map((item: any) =>
          this.getLatestResultByPatient(item.id).then(latestResult => ({
            id: item.id,
            name: `${item.firstName} ${item.lastName}`,
            age: this.calculateAge(item.birthdayDate),
            gender: item.gender.name,
            dni: item.dni,
            latestResult: latestResult !== null ? latestResult * 100 : 0
          }))
        );

        Promise.all(patientPromises).then(patients => {
          this.patients = patients;
          this.filteredPatients = [...this.patients];
          console.log("patients", this.patients);
        }).catch(error => {
          console.error("Failed to fetch latest results", error);
        });
      }
    }, (error: any) => {
      console.error("Get failed", error);
    });
  }


  calculateAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Check if the birthday has occurred yet this year; if not, subtract one from the age
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  selectPatient(patient: Patient) {
    console.log("Entra")
    this.router.navigate(['patient-profile', patient.id]);
    /*this.router.navigate(['patient-profile', patient.id], {
      state: { patient },
    });*/
  }

  getLatestResultByPatient(patientId: string): Promise<number | null> {
    return new Promise((resolve, reject) => {
      this.patientService.getLatestResult(patientId).subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          resolve(response);
        } else {
          resolve(null);
        }
      }, (error: any) => {
        console.error("Get failed", error);
        reject(error);
      });
    });
  }

  clearFilters(): void {
    this.searchForm.reset();
  }

}
