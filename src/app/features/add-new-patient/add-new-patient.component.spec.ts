import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPatientComponent } from './add-new-patient.component';

describe('AddNewPatientComponent', () => {
  let component: AddNewPatientComponent;
  let fixture: ComponentFixture<AddNewPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
