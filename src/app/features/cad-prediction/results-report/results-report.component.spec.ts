import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsReportComponent } from './results-report.component';

describe('ResultsReportComponent', () => {
  let component: ResultsReportComponent;
  let fixture: ComponentFixture<ResultsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
