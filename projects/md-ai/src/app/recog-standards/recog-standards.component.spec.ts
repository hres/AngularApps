import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecogStandardsComponent } from './recog-standards.component';

describe('RecogStandardsComponent', () => {
  let component: RecogStandardsComponent;
  let fixture: ComponentFixture<RecogStandardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecogStandardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecogStandardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
