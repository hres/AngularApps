import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugUseComponent } from './drug-use.component';

describe('DrugUseComponent', () => {
  let component: DrugUseComponent;
  let fixture: ComponentFixture<DrugUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugUseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrugUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
