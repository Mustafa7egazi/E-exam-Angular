import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Examservice } from '../../../services/examservice';
import { IExamList } from '../../../models/iexam-list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adm-dashboard',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './adm-dashboard.html',
  styleUrl: './adm-dashboard.css',
})
export class AdmDashboard implements OnInit, OnDestroy {
  exams: IExamList[] = [];
  private subscription!: Subscription;
  constructor(
    private examService: Examservice,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.examService.getExamList().subscribe({
      next: (data) => {
        this.exams = data;
        this.cdr.detectChanges();
        console.log(this.exams);
      },
      error: (error) => {
        console.error('Error fetching exams:', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  displayExamDetails(examId: number) {
    this.examService.getExamById(examId).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log('Can not Get Exam');
      },
    });
  }
  deleteExam(examId: number) {
    this.examService.deleteExam(examId).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log('Can not Get Exam');
      },
    });
  }
}
