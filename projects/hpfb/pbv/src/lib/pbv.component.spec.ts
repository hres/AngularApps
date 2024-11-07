import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbvComponent } from './pbv.component';

describe('PbvComponent', () => {
  let component: PbvComponent;
  let fixture: ComponentFixture<PbvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
