import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyContactListComponent } from './company-contact-list.component';

describe('CompanyContactListComponent', () => {
  let component: CompanyContactListComponent;
  let fixture: ComponentFixture<CompanyContactListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyContactListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
