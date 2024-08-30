import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardsCompliedComponent } from './standards-complied.component';

describe('StandardsCompliedComponent', () => {
  let component: StandardsCompliedComponent;
  let fixture: ComponentFixture<StandardsCompliedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardsCompliedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StandardsCompliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
