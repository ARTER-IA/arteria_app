import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  basePath: string = 'http://127.0.0.1:5000';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  predict(data: any) {
    return this.http.post(`${this.basePath}/predict`, data, this.httpOptions);
  }
}
