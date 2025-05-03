import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextCustomComponent } from './input-text-custom.component';

describe('InputTextCustomComponent', () => {
  let component: InputTextCustomComponent;
  let fixture: ComponentFixture<InputTextCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTextCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
