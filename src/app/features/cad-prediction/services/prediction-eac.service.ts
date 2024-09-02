import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictionEacService {

  basePath: string = environment.basePath;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getRecommendationsByCalculatedRisk(calculatedRiskId: any) {
    return this.http.get(`${this.basePath}/recommendations/calculatedRisk/${calculatedRiskId}`, this.httpOptions);
  }

  updateRecommendation(recommendationId: any, data: any) {
    return this.http.put(`${this.basePath}/recommendations/${recommendationId}`, data, this.httpOptions);
  }
}
