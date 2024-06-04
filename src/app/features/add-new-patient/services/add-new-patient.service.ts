import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddNewPatientService {
  basePath: string = 'http://localhost:8080/api/v1';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  create(data: any, doctorId: any){
    return this.http.post(`${this.basePath}/patients/doctor/${doctorId}`, data, this.httpOptions);
  }
}
