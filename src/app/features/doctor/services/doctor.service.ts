import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  basePath: string = environment.basePath;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private message: NotificationService) { }

  getDoctorById(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.basePath}/doctors/${id}`, { headers });
    } else {
      return new Observable((observer) => {
        observer.error("Token not found. Please log in again.");
      });
    }
  }

  updateProfile(id: string, doctor: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.put(`${this.basePath}/doctors/${id}`, doctor, { headers });
    } else {
      return new Observable((observer) => {
        observer.error("Token not found. Please log in again.");
      });
    }
  }

  uploadProfilePicture(doctorId: any, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.basePath}/doctors/upload/${doctorId}`, data);
    } else {
      return new Observable((observer) => {
        observer.error("Token not found. Please log in again.");
      });
    }
  }

  getProfilePicture(doctorId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.basePath}/doctors/profilePicture/${doctorId}`, { responseType: 'blob' });
    } else {
      return new Observable((observer) => {
        observer.error("Token not found. Please log in again.");
      });
    }
  }

  delete(doctorId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete(`${this.basePath}/doctors/${doctorId}`, { headers });
    } else {
      return new Observable((observer) => {
        observer.error("Token not found. Please log in again.");
      });
    }
  }

  async deleteSuccessMessage(): Promise<void> {
    this.message.addMessage({
      severity: 'success',
      summary: 'Listo',
      detail: 'Su cuenta ha sido eliminada correctamente.',
      life: 3000
    });
  }

  async deleteErrorMessage(error: any): Promise<void>{
    this.message.addMessage({
      severity: 'error',
      summary: 'Error',
      detail: error,
      life: 3000
    });
  }

  async cancelMessage(): Promise<void> {
    this.message.addMessage({
      severity: 'warn',
      summary: 'Cancelado',
      detail: 'La eliminación de su cuenta ha sido cancelada.',
      life: 3000
    });
  }

  async updateChangesSuccessMessage(): Promise<void> {
    this.message.addMessage({
      severity: 'success',
      summary: 'Listo',
      detail: 'Los cambios han sido guardados correctamente.',
      life: 3000
    });
  }

  async updateChangesErrorMessage(error: any): Promise<void> {
    this.message.addMessage({
      severity: 'error',
      summary: 'Error',
      detail: error,
      life: 3000
    });
  }

  async uploadImageSuccessMessage(): Promise<void> {
    this.message.addMessage({
      severity: 'success',
      summary: 'Listo',
      detail: 'La foto de perfil ha sido actualizada correctamente.',
      life: 3000
    });
  }

  async uploadImageErrorMessage(): Promise<void> {
    this.message.addMessage({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error al subir la foto de perfil.',
      life: 3000
    });
  }
}
