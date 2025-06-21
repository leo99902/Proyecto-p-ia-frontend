import { TestBed } from '@angular/core/testing';

import { ShowPatientService } from './show.patient.service';

describe('ShowPatientService', () => {
  let service: ShowPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
