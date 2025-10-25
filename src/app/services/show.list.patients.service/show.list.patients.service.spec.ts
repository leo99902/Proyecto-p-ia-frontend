import { TestBed } from '@angular/core/testing';

import { ShowListPatientsService } from './show.list.patients.service';

describe('ShowListPatientsService', () => {
  let service: ShowListPatientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowListPatientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
