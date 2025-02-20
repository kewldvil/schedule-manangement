import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleBackComponent } from './schedule-back.component';

describe('ScheduleBackComponent', () => {
  let component: ScheduleBackComponent;
  let fixture: ComponentFixture<ScheduleBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleBackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
