import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { FileUploadModule } from 'primeng/fileupload';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { CommonModule } from '@angular/common';

interface patient {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  birthdayDate: Date;
  gender: string;
  phoneNumber: string;
  height: number;
  weight: number;
  bloodGroup: string;
  insuranceNumber: string;
  policy: string;
  emergencyContact: string;
  emergencyPhoneNumber: string;
  allergies: string;
  currentMedications: string;
  previousIllnesses: string,
  previousSurgeries: string;
  currentConditions: string[];
}

interface genre {
  name: string;
  code: string;
}

@Component({
  selector: 'app-add-new-patient',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ImageModule,
    CardModule,
    DividerModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    InputMaskModule,
    InputTextareaModule,
    MultiSelectModule,
    DropdownModule,
    ChipsModule,
    FileUploadModule,
    CommonModule
  ],
  templateUrl: './add-new-patient.component.html',
  styleUrl: './add-new-patient.component.css'
})

export class AddNewPatientComponent implements OnInit {

  addPatientForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    dni: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    birthdayDate: new FormControl(null, Validators.required),
    gender: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]),
    height: new FormControl(0, Validators.required),
    weight: new FormControl(0, Validators.required),
    bloodGroup: new FormControl('', Validators.required),
    insuranceNumber: new FormControl('', Validators.required),
    policy: new FormControl('', Validators.required),
    emergencyContact: new FormControl('', Validators.required),
    emergencyPhoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]),
    allergies: new FormControl('', Validators.required),
    currentMedications: new FormControl('', Validators.required),
    previousIllnesses: new FormControl('', Validators.required),
    previousSurgeries: new FormControl('', Validators.required),
    currentConditions: new FormControl([], Validators.required)
  });

  genders: genre[] | undefined;
  profilePictureUri: string = '';
  profilePictureFile: File | null = null;

  constructor(private patientService: PatientService, private router: Router) { }

  ngOnInit(): void {

    this.genders = [
      { name: 'Femenino', code: 'F' },
      { name: 'Masculino', code: 'M' }
    ];

  }

  onRegister() {
    const patientResource: patient = {
      firstName: this.addPatientForm.value.firstName ?? '',
      lastName: this.addPatientForm.value.lastName ?? '',
      email: this.addPatientForm.value.email ?? '',
      dni: this.addPatientForm.value.dni ?? '',
      birthdayDate: this.addPatientForm.value.birthdayDate ?? new Date(),
      gender: this.addPatientForm.value.gender ?? '',
      phoneNumber: this.addPatientForm.value.phoneNumber ?? '',
      height: this.addPatientForm.value.height ?? 0,
      weight: this.addPatientForm.value.weight ?? 0,
      bloodGroup: this.addPatientForm.value.bloodGroup ?? '',
      insuranceNumber: this.addPatientForm.value.insuranceNumber ?? '',
      policy: this.addPatientForm.value.policy ?? '',
      emergencyContact: this.addPatientForm.value.emergencyContact ?? '',
      emergencyPhoneNumber: this.addPatientForm.value.emergencyPhoneNumber ?? '',
      allergies: this.addPatientForm.value.allergies ?? '',
      currentMedications: this.addPatientForm.value.currentMedications ?? '',
      previousIllnesses: this.addPatientForm.value.previousIllnesses ?? '',
      previousSurgeries: this.addPatientForm.value.previousSurgeries ?? '',
      currentConditions: this.addPatientForm.value.currentConditions ?? []
    }

    const doctorId = localStorage.getItem('id');

    console.log("Resource", patientResource);

    this.patientService.create(patientResource, doctorId).subscribe((response: any) => {
      console.log("Create successful", response);
      if (response) {
        this.uploadProfilePicture(response.id);
        this.router.navigateByUrl('/home');
      }
    }, (error: any) => {
      console.error("Creation failed", error);
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.profilePictureFile = event.target.files[0];
      console.log("file", this.profilePictureFile);
    }
  }

  /*onUpload(event: any) {
    const file = event.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log("Result", reader.result);
      this.profilePictureUri = reader.result as string;
    };
  }*/

  onUpload(event: any) {
    const file = event.files[0];
    this.profilePictureFile = file;
    console.log("File selected", this.profilePictureFile);

    // Create a URL for the selected image file
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.profilePictureUri = reader.result as string;
    };
  }

  uploadProfilePicture(patientId: number) {
    var formData = new FormData();
    formData.append('file', this.profilePictureFile!);

    this.patientService.uploadProfilePicture(patientId, formData).subscribe((response: any) => {
      console.log("response", response);
      if (response.message === "File uploaded successfully") {
        console.log("Image uploaded successfully");
      }
    }, (error: any) => {
      console.error("Image upload failed", error);
    });
  }

}
