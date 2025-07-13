import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IExamList , IExamDetails} from '../models/Exam/iexam-list';
import { IExamForm } from '../models/Exam/iexam-form';
import { IExamDisplay } from '../models/Exam/iexam-display';
// import {  IExamDetails } from '../models/iexam-list';
import { environment } from '../environment/environment';
// import { IExamForm } from '../models/iexam-form';


@Injectable({
  providedIn: 'root',
})
export class Examservice {
  baseUrl = `${environment.apiBaseUrl}/exam`;
  constructor(private http: HttpClient) {}
  getTotalExams(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }
  getExamList(): Observable<IExamList[]> {
    return this.http.get<IExamList[]>(this.baseUrl);
  }

//   getExamById(id: number): Observable<IExamDisplay> {
//     return this.http.get<IExamDisplay>(`${this.baseUrl}/${id}`);
//   }
  getExamForUpdateById(id: number): Observable<IExamForm> {
    return this.http.get<IExamForm>(`${this.baseUrl}/GetForEdit/${id}`);

  }
  getExamById(id: number): Observable<IExamDetails> {
    return this.http.get<IExamDetails>(`${this.baseUrl}/${id}`);

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
