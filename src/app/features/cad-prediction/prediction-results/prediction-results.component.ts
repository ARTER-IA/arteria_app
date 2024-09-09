import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prediction-results',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardModule,
    DividerModule,
    ButtonModule,
    ChartModule,
    KnobModule,
    ButtonModule
  ],
  templateUrl: './prediction-results.component.html',
  styleUrls: ['./prediction-results.component.css']
})
export class PredictionResultsComponent implements OnInit {
  chartData: any;
  chartOptions: any;

  newResults = new FormGroup({
    prediction_probability: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    const formJson = localStorage.getItem('formData');
    if (formJson) {
      const formData = JSON.parse(formJson);
      this.updateChartData(formData);
    }

    const predictionJson = localStorage.getItem('prediction');
    if (predictionJson) {
      const predictionData = JSON.parse(predictionJson);
      const percentageValue = this.formatPercentage(predictionData.prediction_probability);
      this.newResults.get('prediction_probability')?.setValue(percentageValue.toString());
    }
  }

  constructor(private router: Router) {
    this.chartData = {
      labels: ['BMI', 'BP', 'PR', 'TG', 'LDL', 'HDL', 'HB'],
      datasets: [
        {
          label: 'Health Metrics',
          data: [0, 0, 0, 0, 0, 0, 0],
          fill: true,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: 'rgba(75,192,192,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(75,192,192,1)'
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }

  updateChartData(formData: any) {
    this.chartData.datasets[0].data = [
      formData.bmi,
      formData.bp,
      formData.pr,
      formData.tg,
      formData.ldl,
      formData.hdl,
      formData.hb
    ];
  }

  formatPercentage(value: number): number {
    return parseFloat((value * 100).toFixed(2));
  }

  goToReport(){
    this.router.navigateByUrl('/report'); 
  }
}
