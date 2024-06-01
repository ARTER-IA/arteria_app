import { Component, OnInit } from '@angular/core';
import { MenubarModule } from "primeng/menubar";
import { MenuItem } from "primeng/api";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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

  //doctor:any[]=[];
  doctor: any;

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    //this.getAllUsers();
    this.loadDoctor();
  }

  /*
    getAllUsers() {
      this.http.get('http://localhost:8080/api/v1/doctors').subscribe((res:any)=>{
        this.doctor=res.data;
      }, error => {
        alert("Error in fetching data");
      })
    }*/

  loadDoctor() {
    const doctorId = localStorage.getItem('id');
    if (doctorId) {
      this.getDoctorById(doctorId);
    } else {
      alert("No doctor data found");
    }
  }

  getDoctorById(id: string) {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = { 'Authorization': `Bearer ${token}` };
      this.http.get(`http://localhost:8080/api/v1/doctors/${id}`, { headers }).subscribe((res: any) => {
        this.doctor = res;
      }, error => {
        alert("Error in fetching data");
      })
    } else {
      alert("Token not found. Please log in again.");
    }
  }

}
