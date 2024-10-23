import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatentComponent } from './patent.component';

describe('PatentComponent', () => {
  let component: PatentComponent;
  let fixture: ComponentFixture<PatentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
