import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PredictionEacService } from '../services/prediction-eac.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PatientService } from '../../patient/services/patient.service';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DomSanitizer } from '@angular/platform-browser';
import { KnobModule } from 'primeng/knob';

interface Recommendation {
  id: number;
  description: string;
  calculatedRisk: number;
}

interface Patient {
  fullName: string;
  age: number;
  gender: string;
  date: Date;
}

interface Genre {
  name: string;
  code: string;
}

@Component({
  selector: 'app-results-report',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    KnobModule
  ],
  templateUrl: './results-report.component.html',
  styleUrl: './results-report.component.css'
})
export class ResultsReportComponent implements OnInit{

  predictionReport: FormGroup;
  /*patientName: string = 'John Carter';
  patientAge: number = 45;
  patientGender: string = 'Masculine';
  reportDate: string = '06/19/2024';*/
  results: any = {
    CAD: 66,
    Arrhythmias: 31,
    HeartBlock: 7,
    Ischemia: 75
  };
  recommendation: string | any;
  calculatedRiskId: number = 0;
  resultCAD: number = 0;
  genders: Genre[] | undefined;

  constructor(private fb: FormBuilder, private predictionEACService: PredictionEacService, private patientService: PatientService, private sanitizer: DomSanitizer) {
    this.predictionReport = new FormGroup({
      fullName: new FormControl({ value: '', disabled: true }),
      age: new FormControl({ value: '', disabled: true }),
      gender: new FormControl({ value: '', disabled: true }),
      date: new FormControl({ value: '', disabled: true }),
      CADResult: new FormControl({ value: 0, disabled: false})
    });
  }

  ngOnInit(): void {
    this.genders = [
      { name: 'Femenino', code: 'F' },
      { name: 'Masculino', code: 'M' }
    ];

    const calculatedRiskJson = localStorage.getItem('calculatedRisk');
    const patientId = localStorage.getItem('selectedPatientId');
    if (calculatedRiskJson) {
      const calculatedRisk = JSON.parse(calculatedRiskJson);
      this.calculatedRiskId = calculatedRisk?.id;
      this.resultCAD = Number((calculatedRisk.prediction_probability * 100).toFixed(2));
    }
    this.getPatient(patientId);
    this.getRecommendations(this.calculatedRiskId);
    
  }

  getRecommendations(calculatedRiskId: any) {
    this.predictionEACService.getRecommendationsByCalculatedRisk(calculatedRiskId).subscribe((response: any) => {
      if (response) {
        this.recommendation = this.sanitizer.bypassSecurityTrustHtml(response.description.replace(/\n/g, '<br>'));
        console.log("response", response);
      }
    }, (error: any) => {
      console.error("Get failed", error);
    });
  }

  getPatient(patientId: any) {
    this.patientService.getById(patientId).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.predictionReport.setValue({
          fullName: `${response.firstName} ${response.lastName}`,
          age: this.calculateAge(response.birthdayDate),
          gender: response.gender,
          date: new Date(),
          CADResult: this.resultCAD
        });
      }
    }, (error: any) => {
      console.error("Get failed", error);
    });
  }

  calculateAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }


}
