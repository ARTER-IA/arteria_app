import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(`${this.basePath}/doctors/auth/sign-up`, data, this.httpOptions);
  }
}