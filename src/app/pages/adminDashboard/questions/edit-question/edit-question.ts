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
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading subjects:', error);
        },
      })
    );
  }

  loadQuestion(): void {
    this.isLoading = true;
    this.subscription.add(
      this.questionService.getQuestionById(this.questionId).subscribe({
        next: (question: IQuestion) => {
          this.question = question;
          this.initForm();
          this.populateForm(question);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading question:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Failed to load question. Please try again.');
          this.router.navigate(['/admin/questions']);
        },
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
      options: this.fb.array([]),
    });
  }

  populateForm(question: IQuestion): void {
    // Clear existing options
    while (this.optionsArray.length > 0) {
      this.optionsArray.removeAt(0);
    }

    // Populate form with question data
    this.questionForm.patchValue({
      title: question.title,
      score: question.score,
      type: question.type,
      difficulty: question.difficulty,
      subjectId: question.subjectId,
    });

    // Add options
    question.options.forEach((option) => {
      const optionGroup = this.fb.group({
        title: [option.title, Validators.required],
        isCorrect: [option.isCorrect],
      });
      this.optionsArray.push(optionGroup);
    });
  }

  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption(): void {
    const option = this.fb.group({
      title: ['', Validators.required],
      isCorrect: [false],
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
      } else {
        control.get('isCorrect')?.setValue(true);
      }
    });
    this.cdr.markForCheck();
  }

  addTrueFalseOptions(): void {
    const trueOption = this.fb.group({
      title: ['True', Validators.required],
      isCorrect: [false],
    });

    const falseOption = this.fb.group({
      title: ['False', Validators.required],
      isCorrect: [false],
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
        options: formValue.options,
      };

      this.questionService.updateQuestion(this.questionId, question).subscribe({
        next: (response) => {
          console.log('Question updated successfully:', response);
          this.isLoading = false;
          this.cdr.detectChanges();
          // Navigate back to questions list
          this.router.navigate(['/admin/questions']);
        },
        error: (error) => {
          console.error('Error updating question:', error);
          this.isLoading = false;
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
      control?.markAsTouched();
    });
    this.cdr.markForCheck();
  }

  cancel(): void {
    this.router.navigate(['/admin/questions']);
  }
}
