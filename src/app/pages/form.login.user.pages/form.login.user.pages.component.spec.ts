import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLoginUserPagesComponent } from './form.login.user.pages.component';

describe('FormLoginUserPagesComponent', () => {
  let component: FormLoginUserPagesComponent;
  let fixture: ComponentFixture<FormLoginUserPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLoginUserPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLoginUserPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
