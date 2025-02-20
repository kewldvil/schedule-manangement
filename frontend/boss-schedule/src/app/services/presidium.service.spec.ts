import { TestBed } from '@angular/core/testing';

import { PresidiumService } from './presidium.service';

describe('PresidiumService', () => {
  let service: PresidiumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PresidiumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
