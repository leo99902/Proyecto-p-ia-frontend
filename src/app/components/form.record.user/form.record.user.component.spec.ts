import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRecordUserComponent } from './form.record.user.component';

describe('FormRecordUserComponent', () => {
  let component: FormRecordUserComponent;
  let fixture: ComponentFixture<FormRecordUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRecordUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRecordUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
