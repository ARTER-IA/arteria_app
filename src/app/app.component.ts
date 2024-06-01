import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './features/register/register.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoginComponent,
    RegisterComponent,
    RouterOutlet,
    RouterLink,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'arteria_app';
}
