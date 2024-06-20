import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { DoctorService } from './services/doctor.service';
import { ImageModule } from 'primeng/image';
import { InputTextareaModule } from 'primeng/inputtextarea';

interface doctor {
  username: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: string;
  country: string;
  department: string;
  address: string;
  cmpNumber: string;
  phone: string;
  workplace: string;
  about: string;
  profilePicUri: string;
  email: string;
  isDeleted: number;
}


@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    DividerModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    CommonModule,
    ImageModule
  ],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent implements OnInit {

  doctor: any;
  isEditing = false;

  newDoctor = new FormGroup({
    username: new FormControl({ value: '', disabled: true }, Validators.required),
    firstName: new FormControl({ value: '', disabled: true }, Validators.required),
    lastName: new FormControl({ value: '', disabled: true }, Validators.required),
    dni: new FormControl({ value: '', disabled: true }, Validators.required),
    birthDate: new FormControl({ value: '', disabled: true }, Validators.required),
    gender: new FormControl({ value: '', disabled: true }, Validators.required),
    country: new FormControl({ value: '', disabled: true }, Validators.required),
    department: new FormControl({ value: '', disabled: true }, Validators.required),
    address: new FormControl({ value: '', disabled: true }, Validators.required),
    cmpNumber: new FormControl({ value: '', disabled: true }, Validators.required),
    phone: new FormControl({ value: '', disabled: true }, Validators.required),
    workplace: new FormControl({ value: '', disabled: true }, Validators.required),
    about: new FormControl({ value: '', disabled: true }, Validators.required),
    email: new FormControl({ value: '', disabled: true }, Validators.required),
  });

  constructor(
    private router: Router,
    private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.loadDoctorData();
  }

  loadDoctorData() {
    const doctorId = localStorage.getItem('id');
    if (doctorId) {
      this.doctorService.getDoctorById(doctorId).subscribe(
        (res: any) => {
          console.log('Doctor data:', res);
          this.doctor = res;
          this.patchFormWithDoctorData(res);
        },
        (error: any) => {
          console.error('Error loading patient data:', error)
        });
    } else {
      console.error('Doctor ID not found');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + date.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  patchFormWithDoctorData(doctor: any) {
    this.newDoctor.patchValue({
      username: doctor.username,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      dni: doctor.dni,
      birthDate: this.formatDate(doctor.birthDate),
      email: doctor.email,
      gender: doctor.gender,
      phone: doctor.phone,
      about: doctor.about,
      country: doctor.country,
      address: doctor.address,
      cmpNumber: doctor.cmpNumber,
      department: doctor.department,
      workplace: doctor.workplace
    });
  }


  onSubmit() {
    const doctorResource: doctor = {
      username: this.newDoctor.get('username')?.value ?? '',
      firstName: this.newDoctor.get('firstName')?.value ?? '',
      lastName: this.newDoctor.get('lastName')?.value ?? '',
      dni: this.newDoctor.get('dni')?.value ?? '',
      birthDate: this.newDoctor.get('birthDate')?.value ?? '',
      gender: this.newDoctor.get('gender')?.value ?? '',
      country: this.newDoctor.get('country')?.value ?? '',
      department: this.newDoctor.get('department')?.value ?? '',
      address: this.newDoctor.get('address')?.value ?? '',
      cmpNumber: this.newDoctor.get('cmpNumber')?.value ?? '',
      phone: this.newDoctor.get('phone')?.value ?? '',
      workplace: this.newDoctor.get('workplace')?.value ?? '',
      about: this.newDoctor.get('about')?.value ?? '',
      profilePicUri: this.doctor.profilePicUri ?? '',
      email: this.newDoctor.get('email')?.value ?? '',
      isDeleted: 0
    };

    const doctorId = localStorage.getItem('id'); // Recuperar el ID del localStorage

    if (doctorId) {
      this.doctorService.updateProfile(doctorId, doctorResource).subscribe(
        response => {
          console.log('Doctor updated successfully', response);
          this.newDoctor.disable(); // Deshabilita el formulario después de guardar
          this.isEditing = false; // Cambia el estado a no edición
        },
        error => {
          console.error('Error updating doctor', error);
        }
      );
    } else {
      console.error('Doctor ID not found.');
    }
  }


  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.newDoctor.enable();
    } else {
      this.onSubmit(); // Guardar los datos si se está desactivando la edición
      this.newDoctor.disable();
    }
  }

}
