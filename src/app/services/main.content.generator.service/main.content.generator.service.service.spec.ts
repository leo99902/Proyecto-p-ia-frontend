import { TestBed } from '@angular/core/testing';

import { MainContentGeneratorServiceService } from './main.content.generator.service.service';

describe('MainContentGeneratorServiceService', () => {
  let service: MainContentGeneratorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainContentGeneratorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
