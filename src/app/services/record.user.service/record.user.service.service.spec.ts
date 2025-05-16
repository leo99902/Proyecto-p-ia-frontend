import { TestBed } from '@angular/core/testing';

import { RecordUserServiceService } from './record.user.service.service';

describe('RecordUserServiceService', () => {
  let service: RecordUserServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordUserServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
