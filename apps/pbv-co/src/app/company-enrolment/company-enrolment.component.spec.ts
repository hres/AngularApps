import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulatoryEnrolmentComponent } from './company-enrolment.component';

describe('RegulatoryEnrolmentComponent', () => {
  let component: RegulatoryEnrolmentComponent;
  let fixture: ComponentFixture<RegulatoryEnrolmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegulatoryEnrolmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegulatoryEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
