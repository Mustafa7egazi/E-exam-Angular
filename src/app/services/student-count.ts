import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentCount {
  baseUrl = `${environment.apiBaseUrl}/Student`;

  constructor(private http: HttpClient) { }
  getStudentCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/CountOfStudents`);
  }
  getStudentTryExamCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/CountOfTryExam`);
  }
}
