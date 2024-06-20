import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  basePath: string = 'http://127.0.0.1:5080';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  generateRecommendation(data: any) {
    return this.http.post(`${this.basePath}/results_report`, data, this.httpOptions);
  }
}
