import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router ,RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from '@angular/common/http';
import { passwordMatchValidator } from '../../shared/password-match.directive';
import { RegisterService } from './services/register.service';


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
  isDeleted: number;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    HttpClientModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]),
    firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]),
    birthDate: new FormControl('', Validators.required),
    dni: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required)
  }, {
    validators: passwordMatchValidator('password', 'confirmPassword')
  });

  constructor(private registerService: RegisterService, private router:Router) { }

  ngOnInit(): void {}

  onSubmit() {
    const toSubmit: doctor = {
      username: this.registerForm.value.userName ?? '',
      firstName: this.registerForm.value.firstName ?? '',
      lastName: this.registerForm.value.lastName ?? '',
      dni: this.registerForm.value.dni ?? '',
      birthDate: this.registerForm.value.birthDate ?? '',
      gender: "Male",
      country: "Peru",
      department: "Lima",
      address: "Av. Brasil",
      cmpNumber: "987456",
      phone: "963258741",
      workplace: "Clinica San Pablo",
      about: "I am a doctor",
      profilePicUri: "Photo", 
      isDeleted: 0,
      email: this.registerForm.value.email ?? '',
      password: this.registerForm.value.password ?? ''
    }
    this.registerService.register(toSubmit).subscribe((response:any) => {
      console.log('Registration successful', response);
      this.router.navigate(['/login']);
    }, (error:any) => {
      console.error('Registration failed', error);
    }).add(() => {
    this.refresh();
    });

  }

  refresh() {
    this.registerForm.reset();
  }

}
