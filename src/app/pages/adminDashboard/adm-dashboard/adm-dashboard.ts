import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Examservice } from '../../../services/examservice';
import { IExamList } from '../../../models/Exam/iexam-list';
import { IExamDisplay } from '../../../models/Exam/iexam-display';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adm-dashboard',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './adm-dashboard.html',
  styleUrl: './adm-dashboard.css',
})
export class AdmDashboard implements OnInit, OnDestroy {
  exams: IExamList[] = [];
  totalExams: number = 0;
  private subscription!: Subscription;
  selectedExam!: IExamDisplay | null;
  constructor(
    private examService: Examservice,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.examService.getExamList().subscribe({
      next: (data) => {
        this.exams = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching exams:', error);
      },
    });
    this.subscription = this.examService.getTotalExams().subscribe({
      next: (data) => {
        this.totalExams = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching total exams:', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  displayExamDetails(examId: number) {
    this.examService.getExamById(examId).subscribe({
      next: (response) => {
        this.selectedExam = response;
        this.cdr.detectChanges();
        this.openExamDetailsModal();
      },
      error: (error) => {
        console.log('Can not Get Exam');
      },
    });
  }

  openExamDetailsModal() {
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('examDetailsModal')
    );
    modal.show();
  }
  deleteExam(exam: IExamList) {
    this.examService.deleteExam(exam.id).subscribe({
      next: (response) => {
        exam.isPublished = !exam.isPublished;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Can not Get Exam');
      },
    });
  }
}
