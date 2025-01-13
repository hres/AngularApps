import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcUseOnlyComponent } from './health-canada-only.component';

describe('HcUseOnlyComponent', () => {
  let component: HcUseOnlyComponent;
  let fixture: ComponentFixture<HcUseOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HcUseOnlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HcUseOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
