import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordPatientUsersComponentComponent } from './record.patient.users.component.component';

describe('RecordPatientUsersComponentComponent', () => {
  let component: RecordPatientUsersComponentComponent;
  let fixture: ComponentFixture<RecordPatientUsersComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordPatientUsersComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordPatientUsersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
