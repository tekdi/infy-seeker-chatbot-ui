import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAssistComponent } from './get-assist.component';

describe('GetAssistComponent', () => {
  let component: GetAssistComponent;
  let fixture: ComponentFixture<GetAssistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GetAssistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetAssistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
