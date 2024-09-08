import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { PredictionEacService } from '../services/prediction-eac.service';
import { PatientService } from '../../patient/services/patient.service';
import { DomSanitizer } from '@angular/platform-browser';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import Docxtemplater from 'docxtemplater';


interface Recommendation {
  description: string;
}

interface Genre {
  name: string;
  code: string;
}

@Component({
  selector: 'app-patient-results',
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
  templateUrl: './patient-results.component.html',
  styleUrl: './patient-results.component.css'
})
export class PatientResultsComponent implements OnInit {
  predictionReport: FormGroup;
  calculatedRiskId: number = 0;
  resultCAD: number = 0;
  genders: Genre[] | undefined;
  editMode: boolean = false;
  recommendationToUpdateId: any;
  newRecommendation: Recommendation | any;
  chartData: any;
  chartOptions: any;

  constructor(private fb: FormBuilder, private predictionEACService: PredictionEacService, private patientService: PatientService, private sanitizer: DomSanitizer, private http: HttpClient) {
    this.predictionReport = this.fb.group({
      fullName: new FormControl({ value: '', disabled: true }),
      age: new FormControl({ value: '', disabled: true }),
      gender: new FormControl({ value: '', disabled: true }),
      date: new FormControl({ value: '', disabled: true }),
      CADResult: new FormControl({ value: 0, disabled: true }),
      editableRecommendation: new FormControl(''),
      recommendation: new FormControl(''),

      height: new FormControl({ value: '', disabled: true }),
      weight: new FormControl({ value: '', disabled: true }),
      bloodGroup: new FormControl({ value: '', disabled: true }),
      dni: new FormControl({ value: '', disabled: true }),

      allergies: new FormControl({ value: '', disabled: true }),
      currentMedications: new FormControl({ value: '', disabled: true }),
      previousIllnesses: new FormControl({ value: '', disabled: true }),
      previousSurgeries: new FormControl({ value: '', disabled: true }),
      currentConditions: new FormControl({ value: '', disabled: true }),
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
          CADResult: this.resultCAD,

          height: response.height,
          weight: response.weight,
          bloodGroup: response.bloodGroup,
          dni: response.dni,

          allergies: response.allergies,
          currentMedications: response.currentMedications,
          previousIllnesses: response.previousIllnesses,
          previousSurgeries: response.previousSurgeries,
          currentConditions: response.currentConditions
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

  convertHtmlToDocx(html: string): string {
    return html
      .replace(/<\/?strong>/g, '**')  // Negrita
      .replace(/<\/?b>/g, '**')        // Negrita (etiqueta <b>)
      .replace(/<\/?em>/g, '_')        // Cursiva
      .replace(/<\/?i>/g, '_')         // Cursiva (etiqueta <i>)
      .replace(/<\/?h1>/g, '# ')       // Encabezado 1
      .replace(/<\/?h2>/g, '## ')      // Encabezado 2
      .replace(/<\/?h3>/g, '### ')     // Encabezado 3
      .replace(/<\/?br>/g, '\n')       // Saltos de línea
      .replace(/<\/?p>/g, '\n');       // Párrafo
  }

  downloadWord() {
    this.http.get('/assets/template.docx', { responseType: 'arraybuffer' }).subscribe((template: ArrayBuffer) => {
      const zip = new PizZip(template);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: '{{', end: '}}' } // Usar {} como delimitador
      });

      const fullName = this.predictionReport.get('fullName')?.value;
      const age = this.predictionReport.get('age')?.value;
      const gender = this.predictionReport.get('gender')?.value;
      const CADResult = this.predictionReport.get('CADResult')?.value;

      const height = this.predictionReport.get('height')?.value;
      const weight = this.predictionReport.get('weight')?.value;
      const bloodGroup = this.predictionReport.get('bloodGroup')?.value;
      const dni = this.predictionReport.get('dni')?.value;

      const allergies = this.predictionReport.get('allergies')?.value;
      const currentMedications = this.predictionReport.get('currentMedications')?.value;
      const previousIllnesses = this.predictionReport.get('previousIllnesses')?.value;
      const previousSurgeries = this.predictionReport.get('previousSurgeries')?.value;
      const currentConditions = this.predictionReport.get('currentConditions')?.value;


      const bmi = this.chartData.datasets[1].data[0];
      const bp = this.chartData.datasets[1].data[1];
      const pr = this.chartData.datasets[1].data[2];
      const tg = this.chartData.datasets[1].data[3];
      const ldl = this.chartData.datasets[1].data[4];
      const hdl = this.chartData.datasets[1].data[5];
      const hb = this.chartData.datasets[1].data[6];



      //const recommendation = this.predictionReport.get('recommendation')?.value.replace(/<\/?[^>]+(>|$)/g, "");

      const recommendationHtml = this.predictionReport.get('recommendation')?.value;
      const recommendationFormatted = this.convertHtmlToDocx(recommendationHtml);


      console.log('Nombre:', fullName);
      console.log('Edad:', age);
      console.log('Género:', gender);
      console.log('Resultado CAD:', CADResult);
      console.log('Altura:', height);

      //console.log('Recomendación:', recommendationFormatted);

      try {
        doc.render({
          fullName: fullName,
          age: age,
          gender: gender,
          height: height,
          weight: weight,
          bloodGroup: bloodGroup,
          dni: dni,
          CADResult: CADResult,
          bmi: bmi,
          bp: bp,
          pr: pr,
          tg: tg,
          ldl: ldl,
          hdl: hdl,
          hb: hb,
          allergies: allergies,
          currentMedications: currentMedications,
          previousIllnesses: previousIllnesses,
          previousSurgeries: previousSurgeries,
          currentConditions: currentConditions,
          recommendation: recommendationFormatted,
        });
      } catch (error) {
        console.error('Error al renderizar el documento:', error);
        throw error;
      }

      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      saveAs(out, 'patient-results.docx');
    });
  }



}
