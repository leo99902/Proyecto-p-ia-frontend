import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditComponentComponent } from './modal.edit.component.component';

describe('ModalEditComponentComponent', () => {
  let component: ModalEditComponentComponent;
  let fixture: ComponentFixture<ModalEditComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
