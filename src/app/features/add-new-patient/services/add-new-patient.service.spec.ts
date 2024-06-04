import { TestBed } from '@angular/core/testing';

import { AddNewPatientService } from './add-new-patient.service'

describe('AddNewPatientService', () => {
  let service: AddNewPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddNewPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
