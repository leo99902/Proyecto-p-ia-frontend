import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordQuotesComponentComponent } from './record.quotes.component.component';

describe('RecordQuotesComponentComponent', () => {
  let component: RecordQuotesComponentComponent;
  let fixture: ComponentFixture<RecordQuotesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordQuotesComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordQuotesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
