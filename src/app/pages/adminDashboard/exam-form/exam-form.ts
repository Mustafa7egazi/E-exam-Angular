import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Examservice } from '../../../services/examservice';
import { IExamList } from '../../../models/Exam/iexam-list';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { questionsService } from '../../../services/questions-service';
import {
  IQuestion,
  QuestionType,
  DifficultyLevel,
} from '../../../models/Questions/IQuestions';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SubjectsService } from '../../../services/subjects.service';
import { ISubject } from '../../../models/Subject/ISubject';
import { Router } from '@angular/router';
import { IExamForm } from '../../../models/Exam/iexam-form';

@Component({
  selector: 'app-exam-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exam-form.html',
  styleUrl: './exam-form.css',
})
export class ExamForm implements OnInit, OnDestroy {
  exams: IExamList[] = [];

  // Form
  examForm!: FormGroup;
  isSubmitting: boolean = false;

  // Questions management
  availableQuestions: IQuestion[] = [];
  selectedQuestions: IQuestion[] = [];
  isLoadingQuestions: boolean = false;

  // Subjects
  subjects: ISubject[] = [];
  isLoadingSubjects: boolean = false;

  // Expose enums for template use
  QuestionType = QuestionType;
  DifficultyLevel = DifficultyLevel;

  private subscription!: Subscription;

  constructor(
    private examService: Examservice,
    private questionService: questionsService,
    private subjectsService: SubjectsService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSubjects();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initForm(): void {
    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      subjectId: [null, Validators.required],
      duration: [
        60,
        [Validators.required, Validators.min(1), Validators.max(300)],
      ],
      isPublished: [false],
      // totalMarks: [0, [Validators.required, Validators.min(0)]],
      passMark: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });

    // Listen for subject changes to load questions
    this.examForm.get('subjectId')?.valueChanges.subscribe((subjectId) => {
      if (subjectId) {
        this.loadQuestionsBySubject(subjectId);
      } else {
        this.availableQuestions = [];
        this.selectedQuestions = [];
        this.cdr.markForCheck();
      }
    });
  }

  loadSubjects(): void {
    this.isLoadingSubjects = true;
    this.cdr.markForCheck();

    this.subscription = this.subjectsService.getAllSubjects().subscribe({
      next: (subjects: ISubject[]) => {
        this.subjects = subjects;
        this.isLoadingSubjects = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
        this.isLoadingSubjects = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadQuestionsBySubject(subjectId: number): void {
    this.isLoadingQuestions = true;
    this.cdr.markForCheck();

    this.subscription = this.questionService
      .filterQuestions(subjectId)
      .subscribe({
        next: (questions: IQuestion[]) => {
          this.availableQuestions = questions;
          this.isLoadingQuestions = false;
          this.cdr.markForCheck();
          console.log('Loaded questions:', questions);
        },
        error: (error) => {
          console.error('Error loading questions:', error);
          this.isLoadingQuestions = false;
          this.cdr.markForCheck();
        },
      });
  }

  addQuestionToExam(question: IQuestion): void {
    // Check if question is already selected
    const isAlreadySelected = this.selectedQuestions.some(
      (q) => q.id === question.id
    );

    if (!isAlreadySelected) {
      this.selectedQuestions.push(question);
      this.refreshQuestionsCount();
      console.log('Added question to exam:', question);
    } else {
      console.log('Question already selected:', question.title);
    }
  }

  removeQuestionFromExam(questionId: number): void {
    this.selectedQuestions = this.selectedQuestions.filter(
      (q) => q.id !== questionId
    );
    this.refreshQuestionsCount();
    console.log('Removed question from exam:', questionId);
  }

  isQuestionSelected(questionId: number): boolean {
    return this.selectedQuestions.some((q) => q.id === questionId);
  }

  getSelectedQuestionsCount(): number {
    return this.selectedQuestions.length;
  }

  getTotalScore(): number {
    return this.selectedQuestions.reduce(
      (total, question) => total + question.score,
      0
    );
  }

  // Method to refresh the questions count badge
  refreshQuestionsCount(): void {
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (this.examForm.valid && this.selectedQuestions.length > 0) {
      this.isSubmitting = true;
      this.cdr.markForCheck();

      const formValue = this.examForm.value;
      const examData: IExamForm = {
        id: 0,
        name: formValue.title,
        subjectId: formValue.subjectId,
        durationInMinites: formValue.duration,
        isPublished: formValue.isPublished,
        passMark: Math.floor(this.getTotalScore() * (formValue.passMark / 100)),
        totalMarks: this.getTotalScore(),
        teacherId: 1,
        examQuestions: this.selectedQuestions.map((q) => q.id),
      };

      console.log('Creating exam with data:', examData);

      // Simulate API call with proper error handling
      try {
        // TODO: Replace with actual exam creation service call
        this.examService.addExam(examData).subscribe({
          next: (response) => {
            console.log('Exam created successfully:', response);
            this.isSubmitting = false;
            this.cdr.markForCheck();
            this.router.navigate(['/admin/dashboard']);
          },
          error: (error) => {
            console.error('Error creating exam:', error);
            this.isSubmitting = false;
            this.cdr.markForCheck();
            alert('Failed to create exam. Please try again.');
          },
        });
      } catch (error) {
        console.error('Error in form submission:', error);
        this.isSubmitting = false;
        this.cdr.markForCheck();
        alert('An error occurred while creating the exam. Please try again.');
      }
    } else {
      console.log('Form validation failed');
      this.markFormGroupTouched();

      if (this.selectedQuestions.length === 0) {
        alert('Please select at least one question for the exam.');
      } else if (!this.examForm.valid) {
        alert('Please fill in all required fields correctly.');
      }
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.examForm.controls).forEach((key) => {
      const control = this.examForm.get(key);
      control?.markAsTouched();
    });
    this.cdr.markForCheck();
  }

  cancel(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
