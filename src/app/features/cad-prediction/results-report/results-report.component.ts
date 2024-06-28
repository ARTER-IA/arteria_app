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
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';

interface Recommendation {
  description: string;
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
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    KnobModule,
    ButtonModule,
    InputTextareaModule,
    EditorModule
  ],
  templateUrl: './results-report.component.html',
  styleUrls: ['./results-report.component.css']
})
export class ResultsReportComponent implements OnInit{

  predictionReport: FormGroup;
  recommendation: string | any;
  calculatedRiskId: number = 0;
  resultCAD: number = 0;
  genders: Genre[] | undefined;
  editMode: boolean = false;
  recommendationToUpdateId: any;
  newRecommendation: Recommendation | any;

  constructor(private fb: FormBuilder, private predictionEACService: PredictionEacService, private patientService: PatientService, private sanitizer: DomSanitizer) {
    this.predictionReport = this.fb.group({
      fullName: new FormControl({ value: '', disabled: true }),
      age: new FormControl({ value: '', disabled: true }),
      gender: new FormControl({ value: '', disabled: true }),
      date: new FormControl({ value: '', disabled: true }),
      CADResult: new FormControl({ value: 0, disabled: true }),
      editableRecommendation: new FormControl('')
    });

    this.newRecommendation = { description: '' };
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
        const sanitizedDescription = response.description
          .replace(/\n/g, '<br>') 
          .replace(/### (.*?)(?=<br>|\n|$)/g, '<h3>$1</h3>') 
          .replace(/## (.*?)(?=<br>|\n|$)/g, '<h2>$1</h2>') 
          .replace(/# (.*?)(?=<br>|\n|$)/g, '<h1>$1</h1>') 
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
        this.recommendation = this.sanitizer.bypassSecurityTrustHtml(sanitizedDescription);
        this.predictionReport.patchValue({ editableRecommendation: sanitizedDescription }); 
        console.log("form", this.predictionReport);
        console.log("response", response);
        this.recommendationToUpdateId = response.id.toString();
      }
    }, (error: any) => {
      console.error("Get failed", error);
    });
  }

  getPatient(patientId: any) {
    this.patientService.getById(patientId).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.predictionReport.patchValue({
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

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveRecommendation() {
    const updatedRecommendation = this.predictionReport.get('editableRecommendation')?.value;  
    console.log("updatedRec", updatedRecommendation);    
    //this.recommendation = updatedRecommendation;
    this.newRecommendation.description = updatedRecommendation.toString();
    this.predictionEACService.updateRecommendation(this.recommendationToUpdateId, this.newRecommendation).subscribe((response: any) =>{
      if (response){
        this.recommendation = response.description;
        console.log("responseUpd", response);
      }
    }, (error: any) => {
      console.error("Get failed", error);
    })
    this.toggleEditMode();
  }
}
