import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDrugSubmissionInformationComponent } from './new-drug-submission-information.component';

describe('NewDrugSubmissionInformationComponent', () => {
  let component: NewDrugSubmissionInformationComponent;
  let fixture: ComponentFixture<NewDrugSubmissionInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDrugSubmissionInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDrugSubmissionInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
