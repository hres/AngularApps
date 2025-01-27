import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEnrolmentComponent } from './company-enrolment.component';

describe('CompanyEnrolmentComponent', () => {
  let component: CompanyEnrolmentComponent;
  let fixture: ComponentFixture<CompanyEnrolmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyEnrolmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
