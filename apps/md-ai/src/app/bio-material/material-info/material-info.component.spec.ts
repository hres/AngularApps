import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInfoComponent } from './material-info.component';

describe('MaterialInfoComponent', () => {
  let component: MaterialInfoComponent;
  let fixture: ComponentFixture<MaterialInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
