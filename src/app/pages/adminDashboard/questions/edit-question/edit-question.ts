import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { questionsService } from '../../../../services/questions-service';
import { SubjectsService } from '../../../../services/subjects.service';
import { QuestionFormService } from '../../../../services/question-form.service';
import { IQuestion } from '../../../../models/Questions/IQuestions';
import { ICreateQuestion } from '../../../../models/Questions/icreate-question';
import { ICreateOption } from '../../../../models/Option/icreate-option';
import {
  QuestionType,
  DifficultyLevel,
} from '../../../../models/Questions/IQuestions';
import { ISubject } from '../../../../models/Subject/ISubject';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-question',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-question.html',
  styleUrl: './edit-question.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditQuestionComponent implements OnInit, OnDestroy {
  questionForm!: FormGroup;
  isLoading: boolean = false;
  questionId: number = 0;
  question: IQuestion | null = null;
  questionTypes = Object.values(QuestionType).filter(
    (value) => typeof value === 'string'
  );
  difficultyLevels = Object.values(DifficultyLevel).filter(
    (value) => typeof value === 'string'
  );

  // Expose enums for template use
  QuestionType = QuestionType;
  DifficultyLevel = DifficultyLevel;

  // Subjects from service
  subjects: ISubject[] = [];
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private questionService: questionsService,
    private subjectsService: SubjectsService,
    private questionFormService: QuestionFormService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.questionId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.questionId) {
      this.loadQuestion();
    } else {
      this.router.navigate(['/admin/questions']);
    }
    this.loadSubjects();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadSubjects(): void {
    this.subscription.add(
      this.subjectsService.getAllSubjects().subscribe({
        next: (subjects: ISubject[]) => {
          this.subjects = subjects;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading subjects:', error);
        },
      })
    );
  }

  loadQuestion(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.subscription.add(
      this.questionService.getQuestionById(this.questionId).subscribe({
        next: (question: IQuestion) => {
          this.question = question;
          this.initForm();
          this.populateForm(question);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading question:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
          alert('Failed to load question. Please try again.');
          this.router.navigate(['/admin/questions']);
        },
      })
    );
  }

  initForm(): void {
    this.questionForm = this.questionFormService.createQuestionForm();
  }

  populateForm(question: IQuestion): void {
    // Clear existing options array completely
    this.questionFormService.clearOptionsArray(this.optionsArray);

    // Populate form with question data
    this.questionForm.patchValue({
      title: question.title,
      score: question.score,
      type: question.type,
      difficulty: question.difficulty,
      subjectId: question.subjectId,
    });

    // Add options with proper validation
    question.options.forEach((option) => {
      const optionGroup = this.questionFormService.createOptionForm(
        option.title,
        option.isCorrect
      );
      this.optionsArray.push(optionGroup);
    });

    // Setup validation after adding options
    this.questionFormService.setupOptionValidation(this.optionsArray);

    // Trigger change detection to update UI
    this.cdr.markForCheck();
  }

  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  get isMultipleChoice(): boolean {
    return this.questionForm.get('type')?.value == QuestionType.MultipleChoice;
  }

  get shouldShowAddButton(): boolean {
    const questionType = this.questionForm.get('type')?.value;
    const isMultipleChoice = questionType == QuestionType.MultipleChoice;
    const hasLessThan4Options = this.optionsArray.length < 4;
    return isMultipleChoice && hasLessThan4Options;
  }

  addOption(): void {
    // Only allow adding options for Multiple Choice questions with fewer than 4 options
    if (this.isMultipleChoice && this.optionsArray.length < 4) {
      const option = this.questionFormService.createOptionForm();
      this.optionsArray.push(option);
      this.questionFormService.setupOptionValidation(this.optionsArray);
      this.cdr.markForCheck();
    }
  }

  removeOption(index: number): void {
    // Only allow removal for Multiple Choice questions with more than 3 options
    if (this.isMultipleChoice && this.optionsArray.length > 3) {
      this.optionsArray.removeAt(index);
      this.questionFormService.setupOptionValidation(this.optionsArray);
      this.cdr.markForCheck();
    }
  }

  onQuestionTypeChange(): void {
    const questionType = this.questionForm.get('type')?.value;
    // Handle the question type change
    this.questionFormService.handleQuestionTypeChange(
      questionType,
      this.optionsArray
    );
    // Force form value update to trigger change detection
    this.questionForm.updateValueAndValidity();
    // Ensure change detection is triggered to update the UI
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  onCorrectOptionChange(selectedIndex: number): void {
    this.questionFormService.ensureSingleCorrectOption(
      this.optionsArray,
      selectedIndex
    );
    this.cdr.markForCheck();
  }

  onOptionTextChange(): void {
    // Trigger validation when option text changes
    this.questionFormService.setupOptionValidation(this.optionsArray);
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      this.isLoading = true;
      this.cdr.markForCheck();

      const formValue = this.questionForm.value;
      const question: ICreateQuestion = {
        title: formValue.title,
        score: Number(formValue.score),
        type: Number(formValue.type),
        difficulty: Number(formValue.difficulty),
        subjectId: Number(formValue.subjectId),
        options: formValue.options,
      };

      this.questionService.updateQuestion(this.questionId, question).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.cdr.markForCheck();
          // Navigate back to questions list
          this.router.navigate(['/admin/questions']);
        },
        error: (error) => {
          console.error('Error updating question:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
          alert('Failed to update question. Please try again.');
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.questionForm.controls).forEach((key) => {
      const control = this.questionForm.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched();
      } else {
        control?.markAsTouched();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/questions']);
  }
}
