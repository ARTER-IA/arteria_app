import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { Router } from '@angular/router';
import { FormService } from './services/form.service';
import { PredictionService } from './services/prediction.service';
import { calculatedRisk } from './interfaces/calculated-risk';
import { ResultsReportComponent } from '../cad-prediction/results-report/results-report.component';
import { OpenaiService } from './services/openai.service';
import { DropdownModule } from 'primeng/dropdown';



interface form {
  age: number;
  weight: number;
  length: number;
  sex: string;
  bmi: number;
  dm: number;
  htn: number;
  current_Smoker: number;
  ex_Smoker: number;
  fh: number;
  obesity: number;
  cva: number;
  thyroid_Disease: number;
  bp: number;
  pr: number;
  weak_Peripheral_Pulse: number;
  q_Wave: number;
  st_Elevation: number;
  st_Depression: number;
  tinversion: number;
  lvh: number;
  poor_R_Progression: number;
  tg: number;
  ldl: number;
  hdl: number;
  hb: number;
}

interface calulatedRisk {
  prediction_probability: number;
  predicted_class: number;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    DividerModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    CheckboxModule,
    DropdownModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

export class FormComponent implements OnInit {

  patient: any;
  consentOptions: any[];


  newForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    bloodGroup: new FormControl('', [Validators.required]),

    age: new FormControl(0, [Validators.required]),
    weight: new FormControl(0, [Validators.required]),
    length: new FormControl(0, [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    bmi: new FormControl(0, [Validators.required]),
    dm: new FormControl(0, [Validators.required]),
    htn: new FormControl(0, [Validators.required]),
    current_Smoker: new FormControl(0, [Validators.required]),
    ex_Smoker: new FormControl(0, [Validators.required]),
    fh: new FormControl(0, [Validators.required]),
    obesity: new FormControl(0, [Validators.required]),
    cva: new FormControl(0, [Validators.required]),
    thyroid_Disease: new FormControl(0, [Validators.required]),
    bp: new FormControl(0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]),
    pr: new FormControl(0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]),
    weak_Peripheral_Pulse: new FormControl(0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]),
    q_Wave: new FormControl(null, [Validators.required]),
    st_Elevation: new FormControl(null, [Validators.required]),
    st_Depression: new FormControl(null, [Validators.required]),
    tinversion: new FormControl(null, [Validators.required]),
    lvh: new FormControl(null, [Validators.required]),
    poor_R_Progression: new FormControl(null, [Validators.required]),
    tg: new FormControl(0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]),
    ldl: new FormControl(0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]),
    hdl: new FormControl(0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]),
    hb: new FormControl(0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)])
  });

  constructor(
    private router: Router,
    private formService: FormService,
    private predictionService: PredictionService,
    private resultsReportService: OpenaiService
  ) {
    this.consentOptions = [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 0 }
    ];

  }

  ngOnInit(): void {
    this.loadPatientData();
  }

  loadPatientData() {
    const patientId = localStorage.getItem('selectedPatientId');
    if (patientId) {
      this.formService.getPatientById(patientId).subscribe(
        (res: any) => {
          console.log('Patient data:', res);
          this.patient = res;
          this.patchFormWithPatientData(res);
        },
        (error: any) => {
          console.error('Error loading patient data:', error)
        }
      );
    } else {
      alert("No patient data found");
    }
  }

  patchFormWithPatientData(patient: any) {
    const age = this.calculateAge(patient.birthdayDate);
    const imc = this.calculateIMC(patient.weight, patient.height);
    this.newForm.patchValue({
      firstName: patient.firstName,
      lastName: patient.lastName,
      length: patient.height,
      weight: patient.weight,
      bmi: imc,
      age: age,
      sex: patient.gender.name,
      bloodGroup: patient.bloodGroup,
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

  calculateIMC(weight: number, height: number): number {
    if (height <= 0) return 0;
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  }

  onCheckboxChange(event: any, inputId: string): void {
    const checked = event.checked;
    const patchValue: { [key: string]: number } = {};

    switch (inputId) {
      case 'dm':
      case 'htn':
      case 'current_Smoker':
      case 'ex_Smoker':
      case 'fh':
      case 'obesity':
      case 'cva':
      case 'thyroid_Disease':
        patchValue[inputId] = checked ? 1 : 0;
        this.newForm.patchValue(patchValue);
        break;
      default:
        console.warn(`Unknown control: ${inputId}`);
    }
  }

  onSubmit() {


    const formValue = this.newForm.value;

    const getDropdownValue = (field: any): number => {
      return field && field.value !== undefined ? field.value : 0;
    };

    const formResource: form = {
      age: formValue.age ?? 0,
      weight: formValue.weight ?? 0,
      length: formValue.length ?? 0,
      sex: formValue.sex ?? '',
      bmi: formValue.bmi ?? 0,
      dm: formValue.dm ?? 0,
      htn: formValue.htn ?? 0,
      current_Smoker: formValue.current_Smoker ?? 0,
      ex_Smoker: formValue.ex_Smoker ?? 0,
      fh: formValue.fh ?? 0,
      obesity: formValue.obesity ?? 0,
      cva: formValue.cva ?? 0,
      thyroid_Disease: formValue.thyroid_Disease ?? 0,
      bp: formValue.bp ?? 0,
      pr: formValue.pr ?? 0,
      weak_Peripheral_Pulse: formValue.weak_Peripheral_Pulse ?? 0,
      q_Wave: getDropdownValue(formValue.q_Wave),
      st_Elevation: getDropdownValue(formValue.st_Elevation),
      st_Depression: getDropdownValue(formValue.st_Depression),
      tinversion: getDropdownValue(formValue.tinversion),
      lvh: getDropdownValue(formValue.lvh),
      poor_R_Progression: getDropdownValue(formValue.poor_R_Progression),
      tg: formValue.tg ?? 0,
      ldl: formValue.ldl ?? 0,
      hdl: formValue.hdl ?? 0,
      hb: formValue.hb ?? 0,
    };

    const doctorId = localStorage.getItem('id');
    const patientId = localStorage.getItem('selectedPatientId');

    if (!doctorId || !patientId) {
      console.error("Doctor ID or Patient ID is missing");
      return;
    }

    this.formService.create(formResource, doctorId, patientId).subscribe(
      (response: any) => {
        console.log("Create successful", response);
        if (response) {
          const formData = {
            formId: response.id,
            bmi: response.bmi,
            bp: response.bp,
            pr: response.pr,
            tg: response.tg,
            ldl: response.ldl,
            hdl: response.hdl,
            hb: response.hb
          };

          const formDataJSON = JSON.stringify(formData);
          localStorage.setItem('formData', formDataJSON);

          this.predictionService.predict(formResource).subscribe(
            (predictionResponse: any) => {
              console.log("Prediction successful", predictionResponse);
              if (predictionResponse) {
                localStorage.setItem('prediction', JSON.stringify(predictionResponse));

                const calculatedRiskResource: calculatedRisk = {
                  predicted_class: predictionResponse.predicted_class ?? 0,
                  prediction_probability: predictionResponse.prediction_probability ?? 0,
                };

                /*const formId = localStorage.getItem('formId');
                if (!formId) {
                  console.error("Form ID is missing");
                  return;
                }*/

                this.formService.createCalculatedRisk(calculatedRiskResource, response.id).subscribe(
                  (calculatedRiskResponse: any) => {
                    console.log("Calculated risk created", calculatedRiskResponse);
                    if (calculatedRiskResponse) {
                      localStorage.setItem('calculatedRisk', JSON.stringify(calculatedRiskResponse));

                      const generateRecommendation = {
                        prediction_probability: predictionResponse.prediction_probability,
                        predicted_class: predictionResponse.predicted_class ?? 0,
                        age: response.age,
                        weight: response.weight,
                        length: response.length,
                        sex: response.sex,
                        bmi: response.bmi,
                        dm: response.dm,
                        htn: response.htn,
                        current_Smoker: response.current_Smoker,
                        ex_Smoker: response.ex_Smoker,
                        fh: response.fh,
                        obesity: response.obesity,
                        cva: response.cva,
                        thyroid_Disease: response.thyroid_Disease,
                        bp: response.bp,
                        pr: response.pr,
                        weak_Peripheral_Pulse: response.weak_Peripheral_Pulse,
                        q_Wave: response.q_Wave,
                        st_Elevation: response.st_Elevation,
                        st_Depression: response.st_Depression,
                        tinversion: response.tinversion,
                        lvh: response.lvh,
                        poor_R_Progression: response.poor_R_Progression,
                        tg: response.tg,
                        ldl: response.ldl,
                        hdl: response.hdl,
                        hb: response.hb
                      }

                      this.resultsReportService.generateRecommendation(generateRecommendation).subscribe((openAiResponse: any) => {
                        if (openAiResponse) {
                          const recommendationModel = {
                            description: openAiResponse.message
                          }

                          this.formService.createRecommendation(recommendationModel, calculatedRiskResponse.id).subscribe((recommendationResponse: any) => {
                            if (recommendationResponse) {
                              console.log("recommendation", recommendationResponse);
                            }
                          },
                            (recommendationError: any) => {
                              console.error("Recommendation creation failed", recommendationError);
                            });
                        }

                      },
                        (openAiError: any) => {
                          console.error("Open AI request failed", openAiError);
                        });
                    }

                    // Navegar al final, después de completar la creación del riesgo calculado
                    this.router.navigateByUrl('/prediction-results');
                  },
                  (calculatedRiskError: any) => {
                    console.error("Calculated risk creation failed", calculatedRiskError);
                  }
                );
              }
            },
            (predictionError: any) => {
              console.error("Prediction failed", predictionError);
            }
          );
        }
      },
      (error: any) => {
        console.error("Creation failed", error);
      }
    ).add(() => { });
  }



}
