import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User404PagesComponent } from './user.404.pages.component';

describe('User404PagesComponent', () => {
  let component: User404PagesComponent;
  let fixture: ComponentFixture<User404PagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [User404PagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(User404PagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
