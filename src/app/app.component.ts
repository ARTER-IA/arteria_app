import { Component, OnInit } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './features/register/register.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoginComponent,
    RegisterComponent,
    RouterOutlet,
    RouterLink,
    HttpClientModule,
    ToastModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'arteria_app';

  constructor() {}

  ngOnInit(): void {
  }
}
