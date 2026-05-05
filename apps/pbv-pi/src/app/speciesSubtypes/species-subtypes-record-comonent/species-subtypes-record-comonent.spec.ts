import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesSubtypesRecordComonent } from './species-subtypes-record-comonent';

describe('SpeciesSubtypesRecordComonent', () => {
  let component: SpeciesSubtypesRecordComonent;
  let fixture: ComponentFixture<SpeciesSubtypesRecordComonent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeciesSubtypesRecordComonent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeciesSubtypesRecordComonent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
