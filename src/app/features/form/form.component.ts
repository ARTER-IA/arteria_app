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

/*interface newform {
  height: number;
  weight: number;
  imc: number;
  age: number;
  gender: string;
  smoking: number;
  alcoholism: number;
  sedentaryLifestyle: number;
  familyHistoryOfEcv: number;
  diabetesMellitus: number;
  obesity: number;
  bloodPressure: string;
  coronaryCalcium: number;
  triglycerides: number;
  cholesterolTotal: number;
  cLDL: number;
  cHDL: number;
  cReactiveProtein: number;
  heartRate: number;
  stSegment: number;
  qtInterval: number;
  electricShaft: number;
  rrInterval: number;
  qrsComplex: number;
  tWave: number;
  prSegmentAnomalies: number;
}*/

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
    CheckboxModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

export class FormComponent implements OnInit {
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
    bp: new FormControl(0, [Validators.required]),
    pr: new FormControl(0, [Validators.required]),
    weak_Peripheral_Pulse: new FormControl(0, [Validators.required]),
    q_Wave: new FormControl(0, [Validators.required]),
    st_Elevation: new FormControl(0, [Validators.required]),
    st_Depression: new FormControl(0, [Validators.required]),
    tinversion: new FormControl(0, [Validators.required]),
    lvh: new FormControl(0, [Validators.required]),
    poor_R_Progression: new FormControl(0, [Validators.required]),
    tg: new FormControl(0, [Validators.required]),
    ldl: new FormControl(0, [Validators.required]),
    hdl: new FormControl(0, [Validators.required]),
    hb: new FormControl(0, [Validators.required])
  });

  constructor(private router: Router, private addForm: FormService) { }

  ngOnInit(): void {
    const patientJson = localStorage.getItem('patient');
    if (patientJson) {
      const patient = JSON.parse(patientJson);
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

    /*this.newForm.get('smoking')!.valueChanges.subscribe((value: number | null) => {
      console.log('Smoking checkbox value changed:', value);
    });*/

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
    const heightInMeters = height / 100; // Assuming height is in cm
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  }

  onCheckboxChange(event: any): void {
    const checked = event.checked;
    this.newForm.patchValue({
      dm: checked ? 1 : 0
    });
  }

  onSubmit() {
    const formResource: form = {
      age: this.newForm.value.age ?? 0,
      weight: this.newForm.value.weight ?? 0,
      length: this.newForm.value.length ?? 0,
      sex: this.newForm.value.sex ?? '',
      bmi: this.newForm.value.bmi ?? 0,
      dm: this.newForm.value.dm ?? 0,
      htn: this.newForm.value.htn ?? 0,
      current_Smoker: this.newForm.value.current_Smoker ?? 0,
      ex_Smoker: this.newForm.value.ex_Smoker ?? 0,
      fh: this.newForm.value.fh ?? 0,
      obesity: this.newForm.value.obesity ?? 0,
      cva: this.newForm.value.cva ?? 0,
      thyroid_Disease: this.newForm.value.thyroid_Disease ?? 0,
      bp: this.newForm.value.bp ?? 0,
      pr: this.newForm.value.pr ?? 0,
      weak_Peripheral_Pulse: this.newForm.value.weak_Peripheral_Pulse ?? 0,
      q_Wave: this.newForm.value.q_Wave ?? 0,
      st_Elevation: this.newForm.value.st_Elevation ?? 0,
      st_Depression: this.newForm.value.st_Depression ?? 0,
      tinversion: this.newForm.value.tinversion ?? 0,
      lvh: this.newForm.value.lvh ?? 0,
      poor_R_Progression: this.newForm.value.poor_R_Progression ?? 0,
      tg: this.newForm.value.tg ?? 0,
      ldl: this.newForm.value.ldl ?? 0,
      hdl: this.newForm.value.hdl ?? 0,
      hb: this.newForm.value.hb ?? 0
    }

    const doctorId = localStorage.getItem('id');
    const patientId = localStorage.getItem('patientId');

    this.addForm.create(formResource, doctorId, patientId).subscribe((response: any) => {
      console.log("Create successful", response);
      if (response) {
        localStorage.setItem('form', JSON.stringify(response));
        this.router.navigateByUrl('/home');
      }
    }, (error: any) => {
      console.error("Creation failed", error);
    }).add(() => {
    });
  }
}
