import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISubject } from '../models/Subject/ISubject';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private baseUrl = `${environment.apiBaseUrl}${environment.endpoints.subject}`;

  constructor(private http: HttpClient) {}

  // Get all subjects
  getAllSubjects(): Observable<ISubject[]> {
    return this.http.get<ISubject[]>(this.baseUrl);
  }

  // Add new subject
  addSubject(subject: ISubject): Observable<ISubject> {
    return this.http.post<ISubject>(this.baseUrl, subject);
  }

  // Update subject
  updateSubject(id: number, subject: ISubject): Observable<ISubject> {
    return this.http.put<ISubject>(`${this.baseUrl}/${id}`, subject);
  }
}
