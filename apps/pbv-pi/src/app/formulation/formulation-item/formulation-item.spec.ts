import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulationItem } from './formulation-item.component';

describe('FormulationItem', () => {
  let component: FormulationItem;
  let fixture: ComponentFixture<FormulationItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulationItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulationItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
