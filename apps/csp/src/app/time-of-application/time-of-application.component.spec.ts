import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOfApplicationComponent } from './time-of-application.component';

describe('TimeOfApplicationComponent', () => {
  let component: TimeOfApplicationComponent;
  let fixture: ComponentFixture<TimeOfApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeOfApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeOfApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
