import { TestBed } from '@angular/core/testing';

import { UniformService } from './uniform.service';

describe('UniformService', () => {
  let service: UniformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
