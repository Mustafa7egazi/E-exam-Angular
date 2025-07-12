import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Examservice } from '../../../services/examservice';
import { IExamList } from '../../../models/Exam/iexam-list';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-form',
  imports: [CommonModule],
  templateUrl: './exam-form.html',
  styleUrl: './exam-form.css',
})
export class ExamForm implements OnInit, OnDestroy {
  exams: IExamList[] = [];
  private subscription!: Subscription;
  constructor(
    private examService: Examservice,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {}
  ngOnDestroy(): void {}
}
