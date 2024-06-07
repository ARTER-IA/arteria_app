import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  dni: string;
}

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.css'
})
export class PatientProfileComponent implements OnInit{

  patient: Patient | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.patient = history.state.patient;
    // Si no se obtiene el paciente del estado, puedes manejar la carga del paciente usando el ID de la URL
    if (!this.patient) {
      const patientId = this.route.snapshot.paramMap.get('id');
      console.log("Id del paciente", patientId);
      // Lógica para cargar los detalles del paciente usando el patientId
    }
  }

}
