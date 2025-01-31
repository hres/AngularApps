import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyContactItemComponent } from './company-contact-item.component';

describe('CompanyContactItemComponent', () => {
  let component: CompanyContactItemComponent;
  let fixture: ComponentFixture<CompanyContactItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyContactItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyContactItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
