import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNavigationComponentComponent } from './header.navigation.component.component';

describe('HeaderNavigationComponentComponent', () => {
  let component: HeaderNavigationComponentComponent;
  let fixture: ComponentFixture<HeaderNavigationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNavigationComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderNavigationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
