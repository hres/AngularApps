import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceRecordComponent } from './device-record.component';

describe('DeviceRecordComponent', () => {
  let component: DeviceRecordComponent;
  let fixture: ComponentFixture<DeviceRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeviceRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
