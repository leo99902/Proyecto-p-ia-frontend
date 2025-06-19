import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppleAndSnakeComponent } from './apple.and.snake.component';

describe('AppleAndSnakeComponent', () => {
  let component: AppleAndSnakeComponent;
  let fixture: ComponentFixture<AppleAndSnakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppleAndSnakeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppleAndSnakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
