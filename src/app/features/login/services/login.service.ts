import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  basePath: string = 'http://localhost:8080/api/v1';
  //basePath: string = '/api/v1';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  login(loginData: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.basePath}/doctors/auth/sign-in`, loginData);
  }
}

