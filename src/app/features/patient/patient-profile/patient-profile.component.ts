import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { FileUploadModule } from 'primeng/fileupload';
import { FormService } from '../../form/services/form.service';
import { firstValueFrom } from 'rxjs';

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
  predictionProbability: number;
  createdAt: Date;
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
    ListboxModule,
    FileUploadModule
  ],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent implements OnInit {

  patientId: string | any = "";
  patientFormGroup: FormGroup;
  genders: Genre[] | undefined;
  isEditing: boolean = false;
  results: Result[] = [];
  filteredResults: Result[] = [];
  profilePictureUrl: SafeUrl | string = '';
  profilePictureFile: File | null = null;

  constructor(private route: ActivatedRoute, private patientService: PatientService, private formService: FormService, private sanitizer: DomSanitizer, private router: Router) {
    this.patientFormGroup = new FormGroup({
      firstName: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]),
      lastName: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]),
      birthdayDate: new FormControl({ value: new Date(), disabled: true }, Validators.required),
      gender: new FormControl({ value: '', disabled: true }, Validators.required),
      phoneNumber: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]{9}$/)]),
      dni: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      height: new FormControl({ value: 0, disabled: true }, Validators.required),
      weight: new FormControl({ value: 0, disabled: true }, Validators.required),
      bloodGroup: new FormControl({ value: '', disabled: true }, Validators.required),
      insuranceNumber: new FormControl({ value: '', disabled: true }, Validators.required),
      policy: new FormControl({ value: '', disabled: true }, Validators.required),
      emergencyContact: new FormControl({ value: '', disabled: true }, Validators.required),
      emergencyPhoneNumber: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]{9}$/)]),
      allergies: new FormControl({ value: '', disabled: true }, Validators.required),
      currentMedications: new FormControl({ value: '', disabled: true }, Validators.required),
      previousIllnesses: new FormControl({ value: '', disabled: true }, Validators.required),
      previousSurgeries: new FormControl({ value: '', disabled: true }, Validators.required),
      currentConditions: new FormControl({ value: [], disabled: true }, Validators.required)
    });
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    localStorage.setItem('selectedPatientId', this.patientId.toString());
    console.log("Id del paciente", this.patientId);

    this.genders = [
      { name: 'Female', code: 'F' },
      { name: 'Male', code: 'M' }
    ];

    this.getPatient(this.patientId);
    this.getProfilePicture(this.patientId);
    this.getResultsByPatient(this.patientId);
    // Filter results based on patientId
    //this.filteredResults = this.results.filter(result => result.patientId === this.patientId);
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

  getResultsByPatient(patientId: any) {
    this.patientService.getResultsByPatientId(patientId).subscribe((response: any) => {
      if (response) {
        console.log("response", response);
        this.results = response.map((item: any) => ({
          id: item.id,
          predictionProbability: (Number(item.prediction_probability) * 100).toFixed(2) + '%',
          createdAt: new Date(item.createdAt)
        }))
        console.log("results", this.results);
      }
    }, error => {
      console.error("Get results by patient failed", error);
    })
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

      this.uploadProfilePicture(this.patientId);
    }
  }

  onUpload(event: any) {
    const file = event.files[0];
    this.profilePictureFile = file;
    console.log("File selected", this.profilePictureFile);

    // Create a URL for the selected image file
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.profilePictureUrl = reader.result as string;
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


  goToCADPrediction() {
    this.router.navigateByUrl('/form');
  }

  async onSelectResult(event: any): Promise<void> {
    const selectedItem = event.value;  // Obteniendo el elemento seleccionado
    const selectedId = selectedItem.id;  // Aquí puedes usar la propiedad 'id' o cualquier propiedad del objeto

    console.log("new calculated risk", selectedId);

    try {
      // Primera solicitud asíncrona
      const formResponse = await firstValueFrom(this.formService.getByCalculatedRiskId(selectedId));
      const formData = {
        formId: formResponse.id,
        bmi: formResponse.bmi,
        bp: formResponse.bp,
        pr: formResponse.pr,
        tg: formResponse.tg,
        ldl: formResponse.ldl,
        hdl: formResponse.hdl,
        hb: formResponse.hb
      };
      localStorage.setItem('formData', JSON.stringify(formData));

      // Segunda solicitud asíncrona
      const riskResponse = await firstValueFrom(this.patientService.getCalculatedRiskById(selectedId));
      const calculatedRiskData = {
        id: riskResponse.id,
        predicted_class: riskResponse.predicted_class,
        prediction_probability: riskResponse.prediction_probability,
        createdAt: new Date(riskResponse.createdAt),
        formId: riskResponse.formId
      };
      localStorage.setItem('calculatedRisk', JSON.stringify(calculatedRiskData));

      // Redirección una vez que ambas solicitudes hayan finalizado
      this.router.navigateByUrl('/patient-report-result');
    } catch (error) {
      console.error('Error loading data', error);
    }
  }

}