import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { ListboxModule } from 'primeng/listbox';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Patient {
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

interface Result {
  id: number;
  prediction_probability: number;
  date: Date;
  patientId: string;
}

interface Genre {
  name: string;
  code: string;
}

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    InputTextModule,
    ImageModule,
    CalendarModule,
    ChipsModule,
    DropdownModule,
    ListboxModule
  ],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent implements OnInit {

  patientId: string | null = "";
  patientFormGroup: FormGroup;
  genders: Genre[] | undefined;
  isEditing: boolean = false;
  results: Result[] = [
    { id: 1, prediction_probability: 0.23, date: new Date(), patientId: '1' },
    { id: 2, prediction_probability: 0.45, date: new Date(), patientId: '1' },
    { id: 3, prediction_probability: 0.78, date: new Date(), patientId: '1' },
    { id: 4, prediction_probability: 0.45, date: new Date(), patientId: '1' },
    { id: 5, prediction_probability: 0.78, date: new Date(), patientId: '2' },
    { id: 6, prediction_probability: 0.45, date: new Date(), patientId: '2' },
    { id: 7, prediction_probability: 0.78, date: new Date(), patientId: '3' }
  ];
  filteredResults: Result[] = [];
  //profilePictureUrl: string | ArrayBuffer | null = "";
  //objectURL: any;
  profilePictureUrl: SafeUrl | string = '';

  constructor(private route: ActivatedRoute, private patientService: PatientService, private sanitizer: DomSanitizer) {
    this.patientFormGroup = new FormGroup({
      firstName: new FormControl({ value: '', disabled: true }),
      lastName: new FormControl({ value: '', disabled: true }),
      birthdayDate: new FormControl({ value: new Date(), disabled: true }),
      gender: new FormControl({ value: '', disabled: true }),
      phoneNumber: new FormControl({ value: '', disabled: true }),
      dni: new FormControl({ value: '', disabled: true }),
      email: new FormControl({ value: '', disabled: true }),
      height: new FormControl({ value: 0, disabled: true }),
      weight: new FormControl({ value: 0, disabled: true }),
      bloodGroup: new FormControl({ value: '', disabled: true }),
      insuranceNumber: new FormControl({ value: '', disabled: true }),
      policy: new FormControl({ value: '', disabled: true }),
      emergencyContact: new FormControl({ value: '', disabled: true }),
      emergencyPhoneNumber: new FormControl({ value: '', disabled: true }),
      allergies: new FormControl({ value: '', disabled: true }),
      currentMedications: new FormControl({ value: '', disabled: true }),
      previousIllnesses: new FormControl({ value: '', disabled: true }),
      previousSurgeries: new FormControl({ value: '', disabled: true }),
      currentConditions: new FormControl({ value: [], disabled: true })
    });
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    console.log("Id del paciente", this.patientId);

    this.genders = [
      { name: 'Femenino', code: 'F' },
      { name: 'Masculino', code: 'M' }
    ];

    this.getPatient(this.patientId);
    this.getProfilePicture(this.patientId);
    // Filter results based on patientId
    this.filteredResults = this.results.filter(result => result.patientId === this.patientId);
  }

  getPatient(patientId: any) {
    this.patientService.getById(patientId).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.patientFormGroup.setValue({
          firstName: response.firstName,
          lastName: response.lastName,
          birthdayDate: new Date(response.birthdayDate),
          gender: response.gender,
          phoneNumber: response.phoneNumber,
          dni: response.dni,
          email: response.email,
          height: response.height,
          weight: response.weight,
          bloodGroup: response.bloodGroup,
          insuranceNumber: response.insuranceNumber,
          policy: response.policy,
          emergencyContact: response.emergencyContact,
          emergencyPhoneNumber: response.emergencyPhoneNumber,
          allergies: response.allergies,
          currentMedications: response.currentMedications,
          previousIllnesses: response.previousIllnesses,
          previousSurgeries: response.previousSurgeries,
          currentConditions: response.currentConditions
        });

        //this.objectURL = 'data:image/jpeg;base64,' + response.profilePictureUri;
        //console.log(this.objectURL);
      }
    }, (error: any) => {
      console.error("Get failed", error);
    });
  }

  getProfilePicture(patientId: string | null): void {
    if (patientId) {
      this.patientService.getProfilePicture(patientId).subscribe((image: Blob) => {
        const objectURL = URL.createObjectURL(image);
        this.profilePictureUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }, error => {
        console.error("Get profile picture failed", error);
      });
    }
  }

  onEditProfile() {
    this.isEditing = true;
    this.patientFormGroup.enable();
  }

  onSaveChanges() {
    if (this.patientFormGroup.valid) {
      const updatedPatient = this.patientFormGroup.value;
      console.log("Saving changes", updatedPatient);

      // Call the service to save changes
      this.patientService.update(this.patientId, updatedPatient).subscribe(
        (response) => {
          console.log("Update successful", response);
          this.isEditing = false;
          this.patientFormGroup.disable();
        },
        (error) => {
          console.error("Update failed", error);
        }
      );
    }
  }
}