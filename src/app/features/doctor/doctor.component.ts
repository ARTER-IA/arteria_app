import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { DoctorService } from './services/doctor.service';
import { ImageModule } from 'primeng/image';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { NotificationService } from '../notification/notification.service';


interface doctor {
  username: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: Date;
  gender: string;
  country: string;
  department: string;
  address: string;
  cmpNumber: string;
  phone: string;
  workplace: string;
  about: string;
  profilePicUri: string;
  email: string;
  isDeleted: number;
}


@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    DividerModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    CommonModule,
    ImageModule,
    FileUploadModule,
    ConfirmDialogModule,
    ToastModule,
    DropdownModule,
    CalendarModule
  ],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
  providers: [ConfirmationService, MessageService],
  styles: [
    `
        p-confirm-dialog .p-dialog-title {
            color: #2a2d77; 
        }

        :host ::ng-deep .p-confirm-dialog .p-dialog-content {
            color: #5d5a88; 
        }
    `
  ],
})
export class DoctorComponent implements OnInit {

  doctor: any;
  isEditing = false;
  doctorId: any;
  profilePictureUrl: SafeUrl | string = '';
  profilePictureFile: File | null = null;
  consentOptions: any[];


  newDoctor = new FormGroup({
    username: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]),
    firstName: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]),
    lastName: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]),
    dni: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    birthDate: new FormControl({ value: new Date(), disabled: true }, Validators.required),
    gender: new FormControl({ value: null, disabled: true }, [Validators.required]),
    country: new FormControl({ value: '', disabled: true }, Validators.required),
    department: new FormControl({ value: '', disabled: true }, Validators.required),
    address: new FormControl({ value: '', disabled: true }, Validators.required),
    cmpNumber: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(8)]),
    phone: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]{9}$/)]),
    workplace: new FormControl({ value: '', disabled: true }, Validators.required),
    about: new FormControl({ value: '', disabled: true }, Validators.required),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
  });

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
    this.consentOptions = [
      { label: 'Masculino', value: 'Masculino' },
      { label: 'Femenino', value: 'Femenino' }
    ];
  }

  ngOnInit(): void {
    this.loadDoctorData();
    this.getProfilePicture(this.doctorId);
  }

  loadDoctorData() {
    this.doctorId = localStorage.getItem('id');
    if (this.doctorId) {
      this.doctorService.getDoctorById(this.doctorId).subscribe(
        (res: any) => {
          console.log('Doctor data:', res);
          this.doctor = res;
          this.patchFormWithDoctorData(res);
        },
        (error: any) => {
          console.error('Error loading patient data:', error)
        });
    } else {
      console.error('Doctor ID not found');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + date.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  patchFormWithDoctorData(doctor: any) {
    this.newDoctor.patchValue({
      username: doctor.username,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      dni: doctor.dni,
      birthDate: new Date(doctor.birthDate),
      email: doctor.email,
      gender: doctor.gender,
      phone: doctor.phone,
      about: doctor.about,
      country: doctor.country,
      address: doctor.address,
      cmpNumber: doctor.cmpNumber,
      department: doctor.department,
      workplace: doctor.workplace
    });
  }

  getProfilePicture(doctorId: string | null): void {
    if (doctorId) {
      this.doctorService.getProfilePicture(doctorId).subscribe((image: Blob) => {
        const objectURL = URL.createObjectURL(image);
        this.profilePictureUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }, error => {
        console.error("Get profile picture failed", error);
      });
    }
  }


  onSubmit() {
    const doctorResource: doctor = {
      username: this.newDoctor.get('username')?.value ?? '',
      firstName: this.newDoctor.get('firstName')?.value ?? '',
      lastName: this.newDoctor.get('lastName')?.value ?? '',
      dni: this.newDoctor.get('dni')?.value ?? '',
      birthDate: this.newDoctor.get('birthDate')?.value ?? new Date(),
      gender: this.newDoctor.get('gender')?.value ?? '',
      country: this.newDoctor.get('country')?.value ?? '',
      department: this.newDoctor.get('department')?.value ?? '',
      address: this.newDoctor.get('address')?.value ?? '',
      cmpNumber: this.newDoctor.get('cmpNumber')?.value ?? '',
      phone: this.newDoctor.get('phone')?.value ?? '',
      workplace: this.newDoctor.get('workplace')?.value ?? '',
      about: this.newDoctor.get('about')?.value ?? '',
      profilePicUri: this.doctor.profilePicUri ?? '',
      email: this.newDoctor.get('email')?.value ?? '',
      isDeleted: 0
    };

    const doctorId = localStorage.getItem('id'); // Recuperar el ID del localStorage

    if (doctorId) {
      this.uploadProfilePicture(this.doctorId);
      this.doctorService.updateProfile(doctorId, doctorResource).subscribe(
        (response: any) => {
          if (response) {
            this.doctorService.updateChangesSuccessMessage();
            this.newDoctor.disable(); // Deshabilita el formulario después de guardar
            this.isEditing = false; // Cambia el estado a no edición
          }
        },
        (e: any) => {
          this.doctorService.updateChangesErrorMessage(e.error);
        }
      );      
    } else {
      console.error('Doctor ID not found.');
    }
  }

  onUpload(event: any, fileInput: any) {
    const file = event.files[0];
    this.profilePictureFile = file;
    //console.log("File selected", this.profilePictureFile);
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.profilePictureUrl = reader.result as string;
    };    
  
    fileInput.clear(); 
  }

  uploadProfilePicture(doctorId: number) {
    var formData = new FormData();
    formData.append('file', this.profilePictureFile!);

    this.doctorService.uploadProfilePicture(doctorId, formData).subscribe((response: any) => {
      console.log("response", response);
      if (response.message === "File uploaded successfully") {
        console.log("Image uploaded successfully");
      }
    }, (error: any) => {
      console.error("Image upload failed", error);
    });
  }


  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.newDoctor.enable();
    } else {
      this.onSubmit();
      this.newDoctor.disable();
    }
  }

  deleteAccount(event: Event) {
    this.confirmationService.confirm({
      header: '¿Está seguro de eliminar su cuenta?',
      message: 'Esta acción no se puede deshacer. Por favor, confirme para proceder.',
      accept: () => {
        this.doctorService.delete(this.doctorId).subscribe(
          (response: any) => {
            this.doctorService.deleteSuccessMessage();
            this.router.navigateByUrl('/login');
          },
          (e: any) => {
            this.doctorService.deleteErrorMessage(e.error);
          }
        );
      },
      reject: () => {
        this.doctorService.cancelMessage();
      }
    });
  }

}
