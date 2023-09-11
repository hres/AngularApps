import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkComponent } from './sdk.component';

describe('SdkComponent', () => {
  let component: SdkComponent;
  let fixture: ComponentFixture<SdkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
