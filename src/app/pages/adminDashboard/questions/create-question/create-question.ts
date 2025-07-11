import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { questionsService } from '../../../../services/questions-service';
import { SubjectsService } from '../../../../services/subjects.service';
import { ICreateQuestion } from '../../../../models/Questions/icreate-question';
import { ICreateOption } from '../../../../models/Option/icreate-option';
import { QuestionType, DifficultyLevel } from '../../../../models/Questions/IQuestions';
import { ISubject } from '../../../../models/Subject/ISubject';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-question',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-question.html',
  styleUrl: './create-question.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateQuestionComponent implements OnInit, OnDestroy {
  questionForm!: FormGroup;
  isLoading: boolean = false;
  questionTypes = Object.values(QuestionType).filter(value => typeof value === 'string');
  difficultyLevels = Object.values(DifficultyLevel).filter(value => typeof value === 'string');

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
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading subjects:', error);
        }
      })
    );
  }

  initForm(): void {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      score: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      type: [QuestionType.MultipleChoice, Validators.required],
      difficulty: [DifficultyLevel.Easy, Validators.required],
      subjectId: [null, Validators.required],
      options: this.fb.array([])
    });

    // Add initial options
    this.addOption();
    this.addOption();
  }

  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption(): void {
    const option = this.fb.group({
      title: ['', Validators.required],
      isCorrect: [false]
    });
    this.optionsArray.push(option);
    this.cdr.markForCheck();
  }

  removeOption(index: number): void {
    if (this.optionsArray.length > 2) {
      this.optionsArray.removeAt(index);
      this.cdr.markForCheck();
    }
  }

    onQuestionTypeChange(): void {
    const questionType = this.questionForm.get('type')?.value;

    if (questionType === QuestionType.TrueFalse) {
      // Clear existing options and add True/False options
      while (this.optionsArray.length > 0) {
        this.optionsArray.removeAt(0);
      }

      this.addTrueFalseOptions();
    } else {
      // Clear existing options and add multiple choice options
      while (this.optionsArray.length > 0) {
        this.optionsArray.removeAt(0);
      }

      this.addOption();
      this.addOption();
    }

    this.cdr.markForCheck();
  }

  onCorrectOptionChange(selectedIndex: number): void {
    // Ensure only one option is marked as correct
    this.optionsArray.controls.forEach((control, index) => {
      if (index !== selectedIndex) {
        control.get('isCorrect')?.setValue(false);
      }
    });
    this.cdr.markForCheck();
  }

  addTrueFalseOptions(): void {
    const trueOption = this.fb.group({
      title: ['True', Validators.required],
      isCorrect: [false]
    });

    const falseOption = this.fb.group({
      title: ['False', Validators.required],
      isCorrect: [false]
    });

    this.optionsArray.push(trueOption);
    this.optionsArray.push(falseOption);
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
        options: formValue.options
      };

      this.questionService.addQuestion(question).subscribe({
        next: (response) => {
          console.log('Question created successfully:', response);
          this.isLoading = false;
          this.cdr.detectChanges();
          // Navigate back to questions list
          this.router.navigate(['/admin/questions']);
        },
        error: (error) => {
          console.error('Error creating question:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Failed to create question. Please try again.');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.questionForm.controls).forEach(key => {
      const control = this.questionForm.get(key);
      control?.markAsTouched();
    });
    this.cdr.markForCheck();
  }

  cancel(): void {
    this.router.navigate(['/admin/questions']);
  }
}
