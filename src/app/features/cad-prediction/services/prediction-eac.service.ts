import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PredictionEacService {

  basePath: string = 'http://localhost:8080/api/v1';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getRecommendationsByCalculatedRisk(calculatedRiskId: any){
    return this.http.get(`${this.basePath}/recommendations/calculatedRisk/${calculatedRiskId}`, this.httpOptions);
  }
}
