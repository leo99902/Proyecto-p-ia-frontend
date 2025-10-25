import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPatientUsersComponentComponent } from './list.patient.users.component.component';

describe('ListPatientUsersComponentComponent', () => {
  let component: ListPatientUsersComponentComponent;
  let fixture: ComponentFixture<ListPatientUsersComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPatientUsersComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPatientUsersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
