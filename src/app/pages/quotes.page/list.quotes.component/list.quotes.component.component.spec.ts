import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListQuotesComponentComponent } from './list.quotes.component.component';

describe('ListQuotesComponentComponent', () => {
  let component: ListQuotesComponentComponent;
  let fixture: ComponentFixture<ListQuotesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListQuotesComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListQuotesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
