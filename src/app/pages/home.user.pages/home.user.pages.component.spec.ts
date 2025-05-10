import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUserPagesComponent } from './home.user.pages.component';

describe('HomeUserPagesComponent', () => {
  let component: HomeUserPagesComponent;
  let fixture: ComponentFixture<HomeUserPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeUserPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeUserPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
