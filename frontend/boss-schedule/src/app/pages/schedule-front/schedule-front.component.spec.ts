import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleFrontComponent } from './schedule-front.component';

describe('ScheduleFrontComponent', () => {
  let component: ScheduleFrontComponent;
  let fixture: ComponentFixture<ScheduleFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
