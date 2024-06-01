import { Component, OnInit } from '@angular/core';
import { Card, CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  onLogin() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      console.log('Attempting to log in with', loginData);

      this.http.post('http://localhost:8080/api/v1/doctors/auth/sign-in', loginData).subscribe(
        (res: any) => {
          console.log('API response:', res);
          if (res.roles) {
            alert("Login successful");
            localStorage.setItem('token', res.token);
            localStorage.setItem('id', res.id);
            this.router.navigateByUrl('/home');
          } else {
            alert("Invalid credentials");
          }
        },
        (error: any) => {
          console.error('API error:', error);
          alert("An error occurred while trying to log in.");
        }
      );
    }
  }

  get email() { return this.loginForm.controls['email']; }
  get password() { return this.loginForm.controls['password']; }
}