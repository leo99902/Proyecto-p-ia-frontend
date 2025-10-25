import { TestBed } from '@angular/core/testing';

import { RecordUserService } from './record.user.service.service';

describe('RecordUserServiceService', () => {
  let service: RecordUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
