import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContainerComponentComponent } from './main.container.component.component';

describe('MainContainerComponentComponent', () => {
  let component: MainContainerComponentComponent;
  let fixture: ComponentFixture<MainContainerComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainContainerComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainContainerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
