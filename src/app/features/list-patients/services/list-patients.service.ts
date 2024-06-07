import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListPatientsService {
  basePath: string = 'http://localhost:8080/api/v1';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getByDoctorId(doctorId: any){
    return this.http.get(`${this.basePath}/patients/doctor/${doctorId}`, this.httpOptions);
  }
}
