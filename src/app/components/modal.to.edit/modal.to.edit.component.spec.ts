import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalToEditComponent } from './modal.to.edit.component';

describe('ModalToEditComponent', () => {
  let component: ModalToEditComponent;
  let fixture: ComponentFixture<ModalToEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalToEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalToEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
