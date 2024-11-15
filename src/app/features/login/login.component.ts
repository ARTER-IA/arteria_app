import { Component, OnInit } from '@angular/core';
import { Card, CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './services/login.service';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { EOF } from '@angular/compiler';


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
    ToastModule,
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
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

      this.loginService.login(loginData).subscribe(
        (res: any) => {
          if (res.roles) {
            this.loginService.loginSuccessfulMessage();
            localStorage.setItem('token', res.token);
            localStorage.setItem('id', res.id);
            this.router.navigateByUrl('/home');
          } else {
            this.loginService.invalidCredentialsMessage();
          }
        },
        (e: any) => {
          this.loginService.loginFailedMessage(e.error);
        }
      );
    }
  }

  get email() { return this.loginForm.controls['email']; }
  get password() { return this.loginForm.controls['password']; }
}