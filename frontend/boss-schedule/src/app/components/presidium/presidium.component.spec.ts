import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresidiumComponent } from './presidium.component';

describe('PresidiumComponent', () => {
  let component: PresidiumComponent;
  let fixture: ComponentFixture<PresidiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PresidiumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresidiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
