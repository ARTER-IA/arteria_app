import { TestBed } from '@angular/core/testing';

import { PredictionEacService } from './prediction-eac.service';

describe('PredictionEacService', () => {
  let service: PredictionEacService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredictionEacService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
