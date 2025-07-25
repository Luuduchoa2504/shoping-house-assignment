import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDetailComponent } from './home-detail.component';

describe('HouseDetailComponent', () => {
  let component: HomeDetailComponent;
  let fixture: ComponentFixture<HomeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
