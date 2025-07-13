import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentExamsService } from '../../../services/student-exams-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-exam-results',
  imports: [CommonModule],
  templateUrl: './exam-results.html',
  styleUrl: './exam-results.css',
})
export class ExamResults implements OnInit {
  examResult: any = null;
  examDetails: any = null;
  questionsWithAnswers: any[] = [];
  examId: number = 0;
  studentId: number = 1; // TODO: Replace with actual student ID from auth

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentExamsService: StudentExamsService,
    private cdr: ChangeDetectorRef
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.examResult = navigation.extras.state['examResult'];
      this.examDetails = navigation.extras.state['examDetails'];
      // Ensure questionsWithAnswers is an array
      this.questionsWithAnswers = Array.isArray(this.examResult)
        ? this.examResult
        : [];
      this.examId = this.examDetails?.id;
      console.log('Data received via navigation state');
      console.log('Exam ID:', this.examId);
      console.log('Questions with answers:', this.questionsWithAnswers);
    } else {
      // Try to get examId from route params if available
      this.examId = Number(this.route.snapshot.paramMap.get('id'));
      console.log('Exam ID from route params:', this.examId);
    }
  }

  ngOnInit(): void {
    if (this.examResult && this.examId) {
      // Data was passed via navigation state, no need to fetch questions
      console.log('Using data from navigation state');
      this.cdr.detectChanges();
    } else if (!this.examResult && this.examId) {
      // Fetch result and details if not provided
      this.studentExamsService
        .getExamResultWithAnswers(this.examId, this.studentId)
        .subscribe({
          next: (result) => {
            // Ensure result is an array
            this.questionsWithAnswers = Array.isArray(result) ? result : [];
            console.log(
              'Questions with answers loaded:',
              this.questionsWithAnswers
            );
            this.examResult = result;
            this.cdr.detectChanges();
          },
          error: () => {
            this.router.navigate(['/student-dashboard']);
          },
        });

      this.studentExamsService
        .getExamDetailsForStudent(this.examId, this.studentId)
        .subscribe({
          next: (details) => {
            this.examDetails = details;
            this.cdr.detectChanges();
          },
          error: () => {
            this.router.navigate(['/student-dashboard']);
          },
        });
    } else if (!this.examResult) {
      this.router.navigate(['/student-dashboard']);
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/student-dashboard']);
  }
}
