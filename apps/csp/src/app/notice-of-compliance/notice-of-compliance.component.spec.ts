import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeOfComplianceComponent } from './notice-of-compliance.component';

describe('NoticeOfComplianceComponent', () => {
  let component: NoticeOfComplianceComponent;
  let fixture: ComponentFixture<NoticeOfComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeOfComplianceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeOfComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
