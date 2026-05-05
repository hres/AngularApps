import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesSubtypesListComponent } from './species-subtypes-list-component';

describe('SpeciesSubtypesListComponent', () => {
  let component: SpeciesSubtypesListComponent;
  let fixture: ComponentFixture<SpeciesSubtypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeciesSubtypesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeciesSubtypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
