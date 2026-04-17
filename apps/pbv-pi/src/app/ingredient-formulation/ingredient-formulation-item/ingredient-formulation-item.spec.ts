import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientFormulationItemComponent } from './ingredient-formulation-item.component';

describe('IngredientFormulationItemComponent', () => {
  let component: IngredientFormulationItemComponent;
  let fixture: ComponentFixture<IngredientFormulationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientFormulationItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientFormulationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
