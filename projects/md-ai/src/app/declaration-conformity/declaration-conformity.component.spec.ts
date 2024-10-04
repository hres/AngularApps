import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationConformityComponent } from './declaration-conformity.component';

describe('DeclarationConformityComponent', () => {
  let component: DeclarationConformityComponent;
  let fixture: ComponentFixture<DeclarationConformityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclarationConformityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeclarationConformityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
