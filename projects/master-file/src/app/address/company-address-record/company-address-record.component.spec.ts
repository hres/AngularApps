import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddressRecordComponent } from './company-address-record.component';

describe('CompanyAddressRecordComponent', () => {
  let component: CompanyAddressRecordComponent;
  let fixture: ComponentFixture<CompanyAddressRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAddressRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAddressRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
