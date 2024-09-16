import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  basePath: string = environment.basePath;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private message: NotificationService) { }

  login(loginData: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.basePath}/doctors/auth/sign-in`, loginData);
  }

  async loginSuccessfulMessage(): Promise<void> {
    this.message.addMessage({
      severity: 'success',
      summary: 'Listo',
      detail: 'Inicio de sesión exitoso.',
    });
  }

  async invalidCredentialsMessage(): Promise<void> {
    this.message.addMessage({
      severity: 'error',
      summary: 'Error',
      detail: 'Credenciales inválidas.',
    });
  }

  async loginFailedMessage(error: any): Promise<void> {
    this.message.addMessage({
      severity: 'error',
      summary: 'Error',
      detail: error,
    });
  }
}

