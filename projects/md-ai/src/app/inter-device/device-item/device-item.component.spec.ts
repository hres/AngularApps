import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceItemComponent } from './device-item.component';

describe('DeviceItemComponent', () => {
  let component: DeviceItemComponent;
  let fixture: ComponentFixture<DeviceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeviceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
