import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IExamList } from '../models/Exam/iexam-list';
import { IExamForm } from '../models/Exam/iexam-form';
import { IExamDisplay } from '../models/Exam/iexam-display';
import { environment } from '../enviroment/environment';

@Injectable({
  providedIn: 'root',
})
export class Examservice {
  baseUrl = `${environment.apiBaseUrl}${environment.endpoints.exam}`;
  constructor(private http: HttpClient) {}
  getTotalExams(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }
  getExamList(): Observable<IExamList[]> {
    return this.http.get<IExamList[]>(this.baseUrl);
  }
  getExamById(id: number): Observable<IExamDisplay> {
    return this.http.get<IExamDisplay>(`${this.baseUrl}/${id}`);
  }
  addExam(exam: IExamForm): Observable<IExamForm> {
    return this.http.post<IExamForm>(this.baseUrl, exam);
  }
  updateExam(id: number, exam: IExamForm): Observable<IExamForm> {
    return this.http.put<IExamForm>(`${this.baseUrl}/${id}`, exam);
  }
  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
