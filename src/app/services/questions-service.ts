import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IQuestion } from '../models/Questions/IQuestions';
import { ICreateOption } from '../models/Option/icreate-option';
import { ICreateQuestion } from '../models/Questions/icreate-question';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class questionsService {

  baseUrl = `${environment.apiBaseUrl}${environment.endpoints.questions}`;
  constructor(private http: HttpClient) { }

    getAllQuestions(): Observable<IQuestion[]> {
      return this.http.get<IQuestion[]>(this.baseUrl);
    }

    filterQuestions(subjectId?: number, difficulty?: number): Observable<IQuestion[]> {
      let params = new HttpParams();

      if (subjectId !== undefined) {
        params = params.set('subjectId', subjectId.toString());
      }

      if (difficulty !== undefined) {
        params = params.set('difficulty', difficulty.toString());
      }

      return this.http.get<IQuestion[]>(`${this.baseUrl}/filter`, { params });
    }

    getQuestionById(id: number): Observable<IQuestion> {
      return this.http.get<IQuestion>(`${this.baseUrl}/${id}`);
    }

    addQuestion(question: ICreateQuestion): Observable<{ message: string }> {
      return this.http.post<{ message: string }>(this.baseUrl, question);
    }

    updateQuestion(id: number, question: ICreateQuestion): Observable<{ message: string }> {
      return this.http.put<{ message: string }>(`${this.baseUrl}/${id}`, question);
    }
    deleteQuestion(id: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
