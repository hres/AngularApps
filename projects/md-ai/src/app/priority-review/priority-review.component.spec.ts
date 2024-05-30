import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityReviewComponent } from './priority-review.component';

describe('PriorityReviewComponent', () => {
  let component: PriorityReviewComponent;
  let fixture: ComponentFixture<PriorityReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PriorityReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
