import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesPatientsPageComponent } from './games.patients.page.component';

describe('GamesPatientsPageComponent', () => {
  let component: GamesPatientsPageComponent;
  let fixture: ComponentFixture<GamesPatientsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesPatientsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesPatientsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
