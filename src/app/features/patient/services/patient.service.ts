import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  basePath: string = 'http://localhost:8080/api/v1';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

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

  getCalculatedRiskById(id: any){
    return this.http.get(`${this.basePath}/calculatedRisks/${id}`, this.httpOptions);
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
}
