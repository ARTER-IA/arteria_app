import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { NotificationService } from '../../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  basePath: string = environment.basePath;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private message: NotificationService) { }

  create(data: any, doctorId: any) {
    return this.http.post(`${this.basePath}/patients/doctor/${doctorId}`, data, this.httpOptions);
  }

  getById(patientId: any) {
    return this.http.get(`${this.basePath}/patients/${patientId}`, this.httpOptions);
  }

  getByDoctorId(doctorId: any) {
    return this.http.get(`${this.basePath}/patients/doctor/${doctorId}`, this.httpOptions);
  }

  getResultsByPatientId(patientId: any){
    return this.http.get(`${this.basePath}/calculatedRisks/patient/${patientId}`, this.httpOptions);
  }

  getCalculatedRiskById(id: any): Observable<any> {
    const token = localStorage.getItem('token');  // Asegúrate de enviar el token de autorización si es necesario
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<any>(`${this.basePath}/calculatedRisks/${id}`, { headers });
    } else {
      return new Observable((observer) => {
        observer.error("Token not found. Please log in again.");
      });
    }
  }

  update(patientId: any, data: any) {
    return this.http.put(`${this.basePath}/patients/${patientId}`, data, this.httpOptions);
  }

  uploadProfilePicture(patientId: any, data: any) {
    return this.http.post(`${this.basePath}/patients/upload/${patientId}`, data);
  }

  getProfilePicture(patientId: string) {
    return this.http.get(`${this.basePath}/patients/profilePicture/${patientId}`, { responseType: 'blob' });
  }

  getLatestResult(patientId: string){
    return this.http.get(`${this.basePath}/patients/latestResult/${patientId}`, this.httpOptions);
  }

  async showSuccessMessage(): Promise<void> {
    this.message.addMessage({
      severity: 'success',
      summary: 'Listo',
      detail: 'El paciente ha sido creado correctamente.',
      life: 3000
    });
  }
  
  async showErrorMessage(error: any): Promise<void> {
    this.message.addMessage({
      severity: 'error',
      summary: 'Error',
      detail: error,
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
