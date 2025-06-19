import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindTheEmojiComponentComponent } from './find.the.emoji.component.component';

describe('FindTheEmojiComponentComponent', () => {
  let component: FindTheEmojiComponentComponent;
  let fixture: ComponentFixture<FindTheEmojiComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindTheEmojiComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindTheEmojiComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
