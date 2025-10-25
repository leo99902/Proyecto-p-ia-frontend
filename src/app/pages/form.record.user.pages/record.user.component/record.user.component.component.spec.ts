import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordUserComponentComponent } from './record.user.component.component';

describe('RecordUserComponentComponent', () => {
  let component: RecordUserComponentComponent;
  let fixture: ComponentFixture<RecordUserComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordUserComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordUserComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
