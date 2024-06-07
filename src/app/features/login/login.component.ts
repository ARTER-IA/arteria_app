import { Component, OnInit } from '@angular/core';
import { Card, CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './services/login.service';

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
    HttpClientModule,
    ToastModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit{

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  message: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private loginService: LoginService
  ) {}

  ngOnInit(){
  }

  onLogin() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      console.log('Attempting to log in with', loginData);

      this.loginService.login(loginData).subscribe(
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
          alert("Invalid credentials");
        }
      );
    }
  }

  get email() { return this.loginForm.controls['email']; }
  get password() { return this.loginForm.controls['password']; }
}