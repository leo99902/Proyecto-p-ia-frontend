import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaQuestionsAndAnswersComponent } from './trivia.questions.and.answers.component';

describe('TriviaQuestionsAndAnswersComponent', () => {
  let component: TriviaQuestionsAndAnswersComponent;
  let fixture: ComponentFixture<TriviaQuestionsAndAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriviaQuestionsAndAnswersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriviaQuestionsAndAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
