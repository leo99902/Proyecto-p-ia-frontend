import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRecordUserPagesComponent } from './form.record.user.pages.component';

describe('FormRecordUserPagesComponent', () => {
  let component: FormRecordUserPagesComponent;
  let fixture: ComponentFixture<FormRecordUserPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRecordUserPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRecordUserPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
