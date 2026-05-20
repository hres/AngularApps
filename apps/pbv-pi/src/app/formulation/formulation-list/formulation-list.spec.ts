import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulationList } from './formulation-list.component';

describe('FormulationList', () => {
  let component: FormulationList;
  let fixture: ComponentFixture<FormulationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulationList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulationList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
