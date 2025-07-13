import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentExamsService } from '../../../services/student-exams-service';
import { Router, RouterLink } from '@angular/router';
import { ILoginData } from '../../../models/User/ilogin-data';
import { StorageService } from '../../../services/storageservice';

@Component({
  selector: 'app-stu-dashboard',
  imports: [RouterLink],
  templateUrl: './stu-dashboard.html',
  styleUrl: './stu-dashboard.css',
})
export class StuDashboard implements OnInit {
  availableStudentExams: any[] = [];
  takenExams: any[] = [];
  pendingExams: number = 0;
  userData: ILoginData | null = null;
  userName: string = '';
  availableExamsLoaded: boolean = false;
  takenExamsLoaded: boolean = false;

  constructor(
    private storageService: StorageService,
    private studentExamsService: StudentExamsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.userData = this.storageService.getUser();
    this.userName = this.userData?.user?.name || '';
    this.studentExamsService.getStudentAvailableExams().subscribe({
      next: (data) => {
        this.availableStudentExams = data;
        this.availableExamsLoaded = true;
        console.log('Available exams:', this.availableStudentExams);
        this.updatePendingExams();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching available exams:', error);
        this.availableExamsLoaded = true;
      },
    });

    this.studentExamsService.getAllTakenExams(1).subscribe({
      next: (data) => {
        this.takenExams = data;
        this.takenExamsLoaded = true;
        console.log('Taken exams:', this.takenExams);
        this.updatePendingExams();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching taken exams:', error);
        this.takenExamsLoaded = true;
      },
    });
  }

  updatePendingExams(): void {
    if (this.availableExamsLoaded && this.takenExamsLoaded) {
      this.pendingExams =
        this.availableStudentExams.length - this.takenExams.length;
      console.log('Pending exams:', this.pendingExams);
    }
  }

  isExamTaken(examId: number): boolean {
    console.log('Checking if exam', examId, 'is taken');
    console.log('Taken exams:', this.takenExams);

    // Check different possible structures
    const isTaken = this.takenExams.some((exam: any) => {
      console.log('Comparing exam.id:', exam.id, 'with examId:', examId);
      return exam.id === examId || exam.examId === examId;
    });

    console.log('Is exam taken:', isTaken);
    return isTaken;
  }

  viewResult(examId: number): void {
    const studentId = 1; // TODO: Replace with actual student ID from auth
    this.studentExamsService
      .getExamResultWithAnswers(examId, studentId)
      .subscribe({
        next: (examResult) => {
          this.studentExamsService
            .getExamDetailsForStudent(examId, studentId)
            .subscribe({
              next: (examDetails) => {
                this.router.navigate(['/student/exam-results'], {
                  state: { examResult, examDetails },
                });
              },
              error: (error) => {
                alert('Failed to load exam details.');
              },
            });
        },
        error: (error) => {
          alert('Failed to load exam result.');
        },
      });
  }
}
