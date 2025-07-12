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
import { Router } from '@angular/router';
import { questionsService } from '../../../../services/questions-service';
import { SubjectsService } from '../../../../services/subjects.service';
import { QuestionFormService } from '../../../../services/question-form.service';
import { ICreateQuestion } from '../../../../models/Questions/icreate-question';
import { ICreateOption } from '../../../../models/Option/icreate-option';
import {
  QuestionType,
  DifficultyLevel,
} from '../../../../models/Questions/IQuestions';
import { ISubject } from '../../../../models/Subject/ISubject';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-question',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-question.html',
  styleUrl: './create-question.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateQuestionComponent implements OnInit, OnDestroy {
  questionForm!: FormGroup;
  isLoading: boolean = false;
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
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

  initForm(): void {
    this.questionForm = this.questionFormService.createQuestionForm();
    // Don't add any initial options - they will be added when question type is selected
    // Trigger the question type change to add initial options based on default type
    this.onQuestionTypeChange();
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

    this.questionFormService.handleQuestionTypeChange(
      questionType,
      this.optionsArray
    );
    // Force form value update to trigger change detection
    this.questionForm.updateValueAndValidity();
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

  onSubmit(): void {
    if (this.questionForm.valid) {
      this.isLoading = true;

      const formValue = this.questionForm.value;

      const question: ICreateQuestion = {
        title: formValue.title,
        score: Number(formValue.score),
        type: Number(formValue.type),
        difficulty: Number(formValue.difficulty),
        subjectId: Number(formValue.subjectId),
        options: formValue.options,
      };

      this.questionService.addQuestion(question).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.cdr.markForCheck();
          // Navigate back to questions list
          this.router.navigate(['/admin/questions']);
        },
        error: (error) => {
          console.error('Error creating question:', error);
          console.error('Error details:', error.error);
          this.isLoading = false;
          this.cdr.markForCheck();
          alert('Failed to create question. Please try again.');
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.questionForm.controls).forEach((key) => {
      const control = this.questionForm.get(key);
      control?.markAsTouched();
    });
    this.cdr.markForCheck();
  }

  cancel(): void {
    this.router.navigate(['/admin/questions']);
  }

  onOptionTextChange(): void {
    // Trigger validation for all options when any option text changes
    this.optionsArray.controls.forEach((control) => {
      const titleControl = control.get('title');
      if (titleControl) {
        titleControl.updateValueAndValidity();
      }
    });
    this.cdr.markForCheck();
  }
}
