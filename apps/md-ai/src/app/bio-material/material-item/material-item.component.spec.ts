import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialItemComponent } from './material-item.component';

describe('MaterialItemComponent', () => {
  let component: MaterialItemComponent;
  let fixture: ComponentFixture<MaterialItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
