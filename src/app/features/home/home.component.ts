import { Component, OnInit } from '@angular/core';
import { MenubarModule } from "primeng/menubar";
import { MenuItem } from "primeng/api";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HomeService } from './services/home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MenubarModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  doctor: any;

  constructor(private http: HttpClient, private homeService: HomeService) {

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

}
