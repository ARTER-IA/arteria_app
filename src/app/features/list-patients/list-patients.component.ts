import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListPatientsService } from './services/list-patients.service';
import { AvatarModule } from 'primeng/avatar';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  dni: string;
}

@Component({
  selector: 'app-list-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, AvatarModule],
  templateUrl: './list-patients.component.html',
  styleUrl: './list-patients.component.css'
})
export class ListPatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [...this.patients];
  searchForm: FormGroup;

  constructor(private fb: FormBuilder, private listPatientsService: ListPatientsService) {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    });
  }

  ngOnInit(): void {
    this.searchForm.get('searchQuery')?.valueChanges.subscribe(value => {
      this.filterPatients(value);
    });
    this.getPatients();
  }

  filterPatients(query: string): void {
    if (query) {
      this.filteredPatients = this.patients.filter(patient =>
        patient.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.filteredPatients = [...this.patients];
    }
  }

  getPatients() {
    const doctorId = localStorage.getItem('id');
    this.listPatientsService.getByDoctorId(doctorId).subscribe((response: any) => {
      if (response) {
        this.patients = response.map((item: any) => ({
          id: item.id,
          name: `${item.firstName} ${item.lastName}`,
          age: this.calculateAge(item.birthdayDate),
          gender: item.gender.name,
          dni: item.dni
        }));
        this.filteredPatients = [...this.patients];
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
}
