import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterFileFeeComponent } from './master-file-fee.component';

describe('MasterFileFeeComponent', () => {
  let component: MasterFileFeeComponent;
  let fixture: ComponentFixture<MasterFileFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterFileFeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasterFileFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
