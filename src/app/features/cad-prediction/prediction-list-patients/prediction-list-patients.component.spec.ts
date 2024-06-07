import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionListPatientsComponent } from './prediction-list-patients.component';

describe('PredictionListPatientsComponent', () => {
  let component: PredictionListPatientsComponent;
  let fixture: ComponentFixture<PredictionListPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredictionListPatientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PredictionListPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
