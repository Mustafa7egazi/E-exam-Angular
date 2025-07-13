import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-results',
  imports: [CommonModule],
  templateUrl: './exam-results.html',
  styleUrl: './exam-results.css',
})
export class ExamResults implements OnInit {
  examResult: any = null;
  examDetails: any = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.examResult = navigation.extras.state['examResult'];
      this.examDetails = navigation.extras.state['examDetails'];
    }
  }

  ngOnInit(): void {
    // If no result data, redirect back to dashboard
    if (!this.examResult) {
      this.router.navigate(['/student-dashboard']);
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/student-dashboard']);
  }
}
