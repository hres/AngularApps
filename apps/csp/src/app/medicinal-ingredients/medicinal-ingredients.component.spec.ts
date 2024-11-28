import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicinalIngredientsComponent } from './medicinal-ingredients.component';

describe('MedicinalIngredientsComponent', () => {
  let component: MedicinalIngredientsComponent;
  let fixture: ComponentFixture<MedicinalIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicinalIngredientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicinalIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
