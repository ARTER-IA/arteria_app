import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  basePath: string = environment.basePath;

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
}
