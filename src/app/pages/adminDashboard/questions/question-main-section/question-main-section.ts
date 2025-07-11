import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { questionsService } from '../../../../services/questions-service';
import { SubjectsService } from '../../../../services/subjects.service';
import { IQuestion } from '../../../../models/Questions/IQuestions';
import { QuestionType, DifficultyLevel } from '../../../../models/Questions/IQuestions';
import { ISubject } from '../../../../models/Subject/ISubject';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-question-main-section',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './question-main-section.html',
  styleUrl: './question-main-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionMainSection implements OnInit, OnDestroy {
  questions: IQuestion[] = [];
  filteredQuestions: IQuestion[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  filterForm: FormGroup;
  private subscription = new Subscription();

  // Filter options
  subjects: ISubject[] = [];

  difficultyLevels = [
    { value: DifficultyLevel.Easy, label: 'Easy' },
    { value: DifficultyLevel.Medium, label: 'Medium' },
    { value: DifficultyLevel.Hard, label: 'Hard' }
  ];

  questionTypes = [
    { value: QuestionType.MultipleChoice, label: 'Multiple Choice' },
    { value: QuestionType.TrueFalse, label: 'True/False' }
  ];

  constructor(
    private questionService: questionsService,
    private subjectsService: SubjectsService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.filterForm = this.fb.group({
      subjectId: [''],
      difficulty: [''],
      type: [''],
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadQuestions();
    this.loadSubjects();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadQuestions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscription.add(
      this.questionService.getAllQuestions().subscribe({
        next: (data: IQuestion[]) => {
          this.questions = data;
          this.filteredQuestions = [...data];
          this.isLoading = false;
          // Setup filter subscription after data is loaded
          this.setupFilterSubscription();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error loading questions', err);
          this.errorMessage = 'Failed to load questions. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      })
    );
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

  setupFilterSubscription(): void {
    this.subscription.add(
      this.filterForm.valueChanges.subscribe(() => {
        // Use markForCheck instead of detectChanges for better performance
        this.cdr.markForCheck();
        this.applyFilters();
      })
    );
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    let filtered = [...this.questions];

    // Apply search filter
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(question =>
        question.title.toLowerCase().includes(searchTerm) ||
        question.subjectName.toLowerCase().includes(searchTerm)
      );
    }

    // Apply subject filter
    if (filters.subjectId && filters.subjectId !== '') {
      filtered = filtered.filter(question => question.subjectId === Number(filters.subjectId));
    }

    // Apply difficulty filter
    if (filters.difficulty !== '' && filters.difficulty !== null) {
      filtered = filtered.filter(question => question.difficulty === Number(filters.difficulty));
    }

    // Apply type filter
    if (filters.type !== '' && filters.type !== null) {
      filtered = filtered.filter(question => question.type === Number(filters.type));
    }

    this.filteredQuestions = filtered;
    this.cdr.detectChanges();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filteredQuestions = [...this.questions];
    this.cdr.markForCheck();
    // Trigger filter application after reset
    setTimeout(() => {
      this.applyFilters();
    }, 0);
  }

  deleteQuestion(id: number): void {
    if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      this.subscription.add(
        this.questionService.deleteQuestion(id).subscribe({
          next: () => {
            this.questions = this.questions.filter(q => q.id !== id);
            this.applyFilters(); // Re-apply filters to update filtered list
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            console.error('Error deleting question', err);
            alert('Failed to delete question. Please try again.');
          }
        })
      );
    }
  }

  editQuestion(id: number): void {
    this.router.navigate(['/admin/questions/edit', id]);
  }

  createNewQuestion(): void {
    this.router.navigate(['/admin/questions/create']);
  }

  createNewSubject(): void {
    this.router.navigate(['/admin/subjects/create']);
  }

  getDifficultyClass(difficulty: DifficultyLevel): string {
    switch (difficulty) {
      case DifficultyLevel.Easy:
        return 'badge bg-success';
      case DifficultyLevel.Medium:
        return 'badge bg-warning text-dark';
      case DifficultyLevel.Hard:
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getTypeClass(type: QuestionType): string {
    switch (type) {
      case QuestionType.MultipleChoice:
        return 'badge bg-primary';
      case QuestionType.TrueFalse:
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }

  getCorrectOptionsCount(question: IQuestion): number {
    return question.options.filter(option => option.isCorrect).length;
  }

  // TrackBy functions for better performance
  trackByQuestionId(index: number, question: IQuestion): number {
    return question.id;
  }

  trackBySubjectId(index: number, subject: ISubject): number {
    return subject.id;
  }
}
