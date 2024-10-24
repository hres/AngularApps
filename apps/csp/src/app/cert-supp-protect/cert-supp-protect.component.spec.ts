import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertSuppProtectComponent } from './cert-supp-protect.component';

describe('CertSuppProtectComponent', () => {
  let component: CertSuppProtectComponent;
  let fixture: ComponentFixture<CertSuppProtectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertSuppProtectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertSuppProtectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
