import { TestBed } from '@angular/core/testing';

import { ValuePathnameServiceService } from './value.pathname.service.service';

describe('ValuePathnameServiceService', () => {
  let service: ValuePathnameServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValuePathnameServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
