import { Injectable } from '@angular/core';
import { environment } from '../enviroment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegisterDTO } from '../models/User/user-register-dto';
import { UserStudentDTO } from '../models/User/user-student-dto';
import { UserLoginDTO } from '../models/User/user-login-dto';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // baseUrl = `${environment.apiBaseUrl}${environment.endpoints.auth}`;
  baseUrl = "https://localhost:7138/api/auth";

  constructor(private http: HttpClient) { }

  register(userInput: UserRegisterDTO): Observable<UserStudentDTO> {
    return this.http.post<UserStudentDTO>(`${this.baseUrl}/register`, userInput);
  }

  login(userLoginInput:UserLoginDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, userLoginInput, { responseType: 'text' });
  }
}
