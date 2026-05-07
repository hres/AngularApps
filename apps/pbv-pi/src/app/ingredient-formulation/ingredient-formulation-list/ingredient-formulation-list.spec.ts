import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientFormulationListComponent } from './ingredient-formulation-list.component';

describe('IngredientFormulationListComponent', () => {
  let component: IngredientFormulationListComponent;
  let fixture: ComponentFixture<IngredientFormulationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientFormulationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientFormulationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
