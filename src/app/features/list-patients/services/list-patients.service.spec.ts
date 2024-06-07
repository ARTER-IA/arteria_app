import { TestBed } from '@angular/core/testing';

import { ListPatientsService } from './list-patients.service';

describe('ListPatientsService', () => {
  let service: ListPatientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListPatientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
