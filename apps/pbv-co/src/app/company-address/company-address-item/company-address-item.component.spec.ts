import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddressItemComponent } from './company-address-item.component';

describe('CompanyAddressItemComponent', () => {
  let component: CompanyAddressItemComponent;
  let fixture: ComponentFixture<CompanyAddressItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyAddressItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyAddressItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
