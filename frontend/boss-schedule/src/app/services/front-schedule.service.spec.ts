import { TestBed } from '@angular/core/testing';

import { FrontScheduleService } from './front-schedule.service';

describe('FrontScheduleService', () => {
  let service: FrontScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrontScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
