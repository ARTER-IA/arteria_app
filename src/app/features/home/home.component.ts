import { Component, OnInit } from '@angular/core';
import { MenubarModule } from "primeng/menubar";
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { MenuItem } from "primeng/api";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router ,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeService } from './services/home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MenubarModule,
    HttpClientModule,
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
    ImageModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  doctor: any;

  constructor(private http: HttpClient, private homeService: HomeService, private router: Router) {

  }

  ngOnInit(): void {
    //this.getAllUsers();
    this.loadDoctor();
  }

  loadDoctor() {
    const doctorId = localStorage.getItem('id');
    if (doctorId) {
      this.homeService.getDoctorById(doctorId).subscribe(
        (res: any) => {
          console.log('Doctor data:', res);
          this.doctor = res;
        },
        (error: any) => {
          console.error('Error loading doctor data:', error)
        }
      );
    } else {
      alert("No doctor data found");
    }
  }

  goToAddNewPatient() {
    this.router.navigateByUrl('/add-new-patient');    
  }

  goToSearchPatient(){
    this.router.navigateByUrl('/search-patients');
  }

  goToPrediction() {
    this.router.navigateByUrl('/cad-prediction');
  }

}
