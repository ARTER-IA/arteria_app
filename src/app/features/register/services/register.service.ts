import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../notification/notification.service';

@Injectable({
  providedIn: 'root'
})

export class RegisterService {
  basePath: string = environment.basePath;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private message: NotificationService) { }

  register(data: any) {
    return this.http.post(`${this.basePath}/doctors/auth/sign-up`, data, this.httpOptions);
  }

  async registerSuccessfulMessage(): Promise<void> {
    this.message.addMessage({
      severity: 'success',
      summary: 'Listo',
      detail: 'Registro exitoso.',
    });
  }

  async registerFailedMessage(error: any): Promise<void> {
    this.message.addMessage({
      severity: 'error',
      summary: 'Error',
      detail: error,
    });
  }
}