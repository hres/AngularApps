import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesSubtypesDetailComponent } from './species-subtypes-detail-component';

describe('SpeciesSubtypesDetailComponent', () => {
  let component: SpeciesSubtypesDetailComponent;
  let fixture: ComponentFixture<SpeciesSubtypesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeciesSubtypesDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeciesSubtypesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
