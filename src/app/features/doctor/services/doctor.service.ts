import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  basePath: string = 'http://localhost:8080/api/v1';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

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
}
