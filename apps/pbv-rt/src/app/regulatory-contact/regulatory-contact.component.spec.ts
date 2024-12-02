import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulatoryContactComponent } from './regulatory-contact.component';

describe('RegulatoryContactComponent', () => {
  let component: RegulatoryContactComponent;
  let fixture: ComponentFixture<RegulatoryContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegulatoryContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegulatoryContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
