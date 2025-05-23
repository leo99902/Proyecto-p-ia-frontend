import { TestBed } from '@angular/core/testing';

import { GetListUserService } from './get.list.user.service.service';

describe('GetUserServiceService', () => {
  let service: GetListUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetListUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
