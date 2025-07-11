import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IExamList } from '../models/iexam-list';
import { IExamForm } from '../models/iexam-form';

@Injectable({
  providedIn: 'root',
})
export class Examservice {
  baseUrl = 'https://localhost:7138/api/exam';
  constructor(private http: HttpClient) { }
  getTotalExams(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }
  getExamList(): Observable<IExamList[]> {
    return this.http.get<IExamList[]>(this.baseUrl);
  }
  getExamById(id: number): Observable<IExamList> {
    return this.http.get<IExamList>(`${this.baseUrl}/${id}`);
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
