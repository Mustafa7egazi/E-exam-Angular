import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentExamsService {
  baseUrl = environment.apiBaseUrl;
  constructor(private HttpClient: HttpClient) {}

  getStudentAvailableExams(): Observable<any[]> {
    return this.HttpClient.get<any[]>(`${this.baseUrl}/Student/exams`);
  }

  getAllTakenExams(id: number): Observable<any[]> {
    return this.HttpClient.get<any[]>(
      `${this.baseUrl}/Student/${id}/TakenExams`
    );
  }

  getExamDetailsForStudent(examId: number, studentId: number): Observable<any> {
    return this.HttpClient.get<any>(
      `${this.baseUrl}/Student/${studentId}/exams/${examId}`
    );
  }

  getExamQuestionsForStudent(examId: number): Observable<any[]> {
    return this.HttpClient.get<any[]>(
      `${this.baseUrl}/Student/exam/${examId}/questions`
    );
  }

  submitExamAnswers(
    examId: number,
    studentId: number,
    answers: number[]
  ): Observable<any> {
    return this.HttpClient.post<any>(
      `${this.baseUrl}/Student/${studentId}/exams/${examId}/submit`,
      { answers }
    );
  }

  getExamResultWithAnswers(examId: number, studentId: number): Observable<any> {
    return this.HttpClient.get<any>(
      `${this.baseUrl}/Student/${studentId}/exams/${examId}/answers`
    );
  }
}
