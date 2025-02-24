import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLineComponent } from './product-line.component';

describe('ProductLineComponent', () => {
  let component: ProductLineComponent;
  let fixture: ComponentFixture<ProductLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
