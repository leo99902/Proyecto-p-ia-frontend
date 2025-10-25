import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredUserListComponentComponent } from './registered.user.list.component.component';

describe('RegisteredUserListComponentComponent', () => {
  let component: RegisteredUserListComponentComponent;
  let fixture: ComponentFixture<RegisteredUserListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredUserListComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredUserListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
