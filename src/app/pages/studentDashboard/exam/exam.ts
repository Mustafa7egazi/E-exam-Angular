import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentExamsService } from '../../../services/student-exams-service';
import { Examservice } from '../../../services/examservice';
import {
  IExamDetails,
  IExamQuestion,
  IExamAnswer,
} from '../../../models/Exam/iexam-list';

@Component({
  selector: 'app-exam',
  imports: [CommonModule, FormsModule],
  templateUrl: './exam.html',
  styleUrl: './exam.css',
})
export class Exam implements OnInit, OnDestroy {
  examId: number = 0;
  studentId: number = 1; // This should come from authentication service
  examDetails: IExamDetails | null = null;
  questions: IExamQuestion[] = [];
  currentQuestionIndex: number = 0;
  answers: Map<number, number> = new Map(); // questionId -> selectedOptionId
  flaggedQuestions: Set<number> = new Set();
  timeLeft: number = 0;
  timerInterval: any;
  isLoading: boolean = true;
  isSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentExamsService: StudentExamsService,
    private cdr: ChangeDetectorRef,
    private examService: Examservice
  ) {}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Loading exam with ID:', this.examId);

    // Load exam directly without API connection test
    this.loadExam();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadExam(): void {
    this.isLoading = true;
    console.log('Starting to load exam...');
    console.log('Exam ID:', this.examId);
    console.log('Exam service base URL:', this.examService.baseUrl);

    // Check if examId is valid
    if (!this.examId || isNaN(this.examId)) {
      console.error('Invalid exam ID:', this.examId);
      this.isLoading = false;
      alert('Invalid exam ID. Please try again.');
      return;
    }

    // Load exam details
    this.examService.getExamById(this.examId).subscribe({
      next: (examDetails) => {
        console.log('Exam details loaded successfully:', examDetails);
        this.examDetails = examDetails;
        this.timeLeft = examDetails.durationInMinites * 60; // Convert to seconds
        this.startTimer();
        this.loadQuestions();
      },
      error: (error) => {
        console.error('Error loading exam details:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          url: error.url,
        });
        this.isLoading = false;
        this.cdr.detectChanges();
        alert('Failed to load exam details. Please try again.');
      },
    });
  }

  loadQuestions(): void {
    console.log('Loading questions for exam ID:', this.examId);
    console.log('Student service base URL:', this.studentExamsService.baseUrl);

    this.studentExamsService.getExamQuestionsForStudent(this.examId).subscribe({
      next: (questions) => {
        console.log('Questions loaded successfully:', questions);
        console.log('Number of questions loaded:', questions.length);

        this.questions = questions;
        this.currentQuestionIndex = 0; // Ensure we start with the first question
        this.isLoading = false;

        console.log('Loading completed, isLoading set to false');
        console.log('Current question:', this.currentQuestion);
        console.log('Questions array:', this.questions);

        // Verify the first question is properly set
        if (this.questions.length > 0) {
          console.log('First question details:', {
            id: this.questions[0].id,
            title: this.questions[0].title,
            optionsCount: this.questions[0].options?.length || 0,
          });
        }

        // Force change detection to update the UI
        setTimeout(() => {
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          console.log('Change detection triggered after timeout');
          console.log('isLoading state:', this.isLoading);
          console.log('questions length:', this.questions.length);
          console.log('currentQuestion:', this.currentQuestion);
        }, 100);
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          url: error.url,
        });
        this.isLoading = false;
        this.cdr.detectChanges();
        alert('Failed to load exam questions. Please try again.');
      },
    });
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.cdr.detectChanges();
      if (this.timeLeft <= 0) {
        this.submitExam();
      }
    }, 1000);
  }

  get currentQuestion(): IExamQuestion | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get answeredCount(): number {
    return this.answers.size;
  }

  get flaggedCount(): number {
    return this.flaggedQuestions.size;
  }

  get formattedTime(): string {
    const hours = Math.floor(this.timeLeft / 3600);
    const minutes = Math.floor((this.timeLeft % 3600) / 60);
    const seconds = this.timeLeft % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  selectAnswer(questionId: number, optionId: number): void {
    this.answers.set(questionId, optionId);
    this.cdr.detectChanges();
  }

  isAnswerSelected(questionId: number, optionId: number): boolean {
    return this.answers.get(questionId) === optionId;
  }

  isQuestionAnswered(questionIndex: number): boolean {
    const question = this.questions[questionIndex];
    return question ? this.answers.has(question.id) : false;
  }

  isQuestionFlagged(questionIndex: number): boolean {
    const question = this.questions[questionIndex];
    return question ? this.flaggedQuestions.has(question.id) : false;
  }

  toggleFlag(): void {
    if (this.currentQuestion) {
      if (this.flaggedQuestions.has(this.currentQuestion.id)) {
        this.flaggedQuestions.delete(this.currentQuestion.id);
      } else {
        this.flaggedQuestions.add(this.currentQuestion.id);
      }
    }
    this.cdr.detectChanges();
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
      this.cdr.detectChanges();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.cdr.detectChanges();
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.cdr.detectChanges();
    }
  }

  submitExam(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    // Convert answers map to array format expected by API
    const answersArray: number[] = [];
    this.questions.forEach((question) => {
      const selectedOptionId = this.answers.get(question.id);
      if (selectedOptionId) {
        answersArray.push(selectedOptionId);
      }
    });

    console.log(answersArray);

    this.studentExamsService
      .submitExamAnswers(this.examId, this.studentId, answersArray)
      .subscribe({
        next: (result) => {
          this.isSubmitting = false;
          // Navigate to exam results with the result data
          this.router.navigate(['/student-dashboard'], {
            state: { examResult: result, examDetails: this.examDetails },
          });
        },
        error: (error) => {
          console.error('Error submitting exam:', error);
          this.isSubmitting = false;
          // Handle error - maybe show a message to user
        },
      });
  }

  confirmSubmit(): void {
    // This will be called when user clicks submit in the modal
    this.submitExam();
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  retryLoad(): void {
    console.log('Retrying to load exam...');
    this.loadExam();
  }

  // Debug method to test loading state
  testLoadingState(): void {
    console.log('Current isLoading state:', this.isLoading);
    this.isLoading = false;
    this.cdr.detectChanges();
    console.log('isLoading set to false, change detection triggered');
  }
}
