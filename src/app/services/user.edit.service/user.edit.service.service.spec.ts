import { TestBed } from '@angular/core/testing';

import { UserEditServiceService } from './user.edit.service.service';

describe('UserEditServiceService', () => {
  let service: UserEditServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserEditServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
