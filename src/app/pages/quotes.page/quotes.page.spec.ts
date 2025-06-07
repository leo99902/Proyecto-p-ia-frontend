import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesPagesComponent } from './quotes.page';

describe('QuotesPagesComponent', () => {
  let component: QuotesPagesComponent;
  let fixture: ComponentFixture<QuotesPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotesPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotesPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
