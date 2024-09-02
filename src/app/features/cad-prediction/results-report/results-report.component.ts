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
import { ChartModule } from 'primeng/chart';

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
    EditorModule,
    ChartModule
  ],
  templateUrl: './results-report.component.html',
  styleUrls: ['./results-report.component.css']
})
export class ResultsReportComponent implements OnInit {

  predictionReport: FormGroup;
  calculatedRiskId: number = 0;
  resultCAD: number = 0;
  genders: Genre[] | undefined;
  editMode: boolean = false;
  recommendationToUpdateId: any;
  newRecommendation: Recommendation | any;
  chartData: any;
  chartOptions: any;

  constructor(private fb: FormBuilder, private predictionEACService: PredictionEacService, private patientService: PatientService, private sanitizer: DomSanitizer) {
    this.predictionReport = this.fb.group({
      fullName: new FormControl({ value: '', disabled: true }),
      age: new FormControl({ value: '', disabled: true }),
      gender: new FormControl({ value: '', disabled: true }),
      date: new FormControl({ value: '', disabled: true }),
      CADResult: new FormControl({ value: 0, disabled: true }),
      editableRecommendation: new FormControl(''),
      recommendation: new FormControl('')
    });

    this.newRecommendation = { description: '' };

    this.chartData = {
      labels: ['BMI', 'BP', 'PR', 'TG', 'LDL', 'HDL', 'HB'],
      datasets: [
        {
          label: 'Minimal Normal Health Metrics',
          data: [18.5, 90, 60, 0, 0, 40, 13.8],
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
        },
        {
          label: 'Patient Health Metrics',
          data: [0, 0, 0, 0, 0, 0, 0],
          fill: true,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: 'rgba(75,192,192,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(75,192,192,1)'
        },
        {
          label: 'Maximum Normal Health Metrics',
          data: [24.9, 120, 100, 150, 100, 120, 17.2],
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          position: 'bottom', // Cambia 'bottom' a 'top', 'left', o 'right' según lo que necesites
        }
      }
    };
  }

  ngOnInit(): void {
    this.genders = [
      { name: 'Femenino', code: 'F' },
      { name: 'Masculino', code: 'M' }
    ];

    const formJson = localStorage.getItem('formData');
    if (formJson) {
      const formData = JSON.parse(formJson);
      this.updateChartData(formData);
    }

    const calculatedRiskJson = localStorage.getItem('calculatedRisk');
    const patientId = localStorage.getItem('selectedPatientId');
    if (calculatedRiskJson) {
      const calculatedRisk = JSON.parse(calculatedRiskJson);
      this.calculatedRiskId = calculatedRisk.id;
      this.resultCAD = Number((calculatedRisk.prediction_probability * 100).toFixed(2));
    }
    this.getPatient(patientId);
    this.getRecommendations(this.calculatedRiskId);
  }

  updateChartData(formData: any) {
    this.chartData.datasets[1].data = [
      formData.bmi,
      formData.bp,
      formData.pr,
      formData.tg,
      formData.ldl,
      formData.hdl,
      formData.hb
    ];
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
        //this.recommendation = this.sanitizer.bypassSecurityTrustHtml(sanitizedDescription);
        this.predictionReport.patchValue({ editableRecommendation: sanitizedDescription });
        this.predictionReport.patchValue({ recommendation: sanitizedDescription });
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
          gender: response.gender.name,
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
    //const updatedRecommendation = this.predictionReport.get('editableRecommendation')?.value; 
    let updatedRecommendation = this.predictionReport.get('editableRecommendation')?.value;

    updatedRecommendation = updatedRecommendation
      .replace(/<p><br\s*\/?><\/p>/g, '<br>')
      .replace(/<br\s*\/?><br\s*\/?>/g, '<br>')
      .trim();

    console.log("updatedRec", updatedRecommendation);
    //this.recommendation = updatedRecommendation;
    this.newRecommendation.description = updatedRecommendation.toString();
    this.predictionEACService.updateRecommendation(this.recommendationToUpdateId, this.newRecommendation).subscribe((response: any) => {
      if (response) {
        //this.recommendation = response.description;
        this.predictionReport.patchValue({ recommendation: response.description });
        console.log("responseUpd", response);
      }
    }, (error: any) => {
      console.error("Get failed", error);
    })
    this.toggleEditMode();
  }
}
