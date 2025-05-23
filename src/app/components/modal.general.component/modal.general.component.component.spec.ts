import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGeneralComponentComponent } from './modal.general.component.component';

describe('ModalGeneralComponentComponent', () => {
  let component: ModalGeneralComponentComponent;
  let fixture: ComponentFixture<ModalGeneralComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalGeneralComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalGeneralComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
