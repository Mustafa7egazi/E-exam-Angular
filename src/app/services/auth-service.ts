import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegisterDTO } from '../models/User/user-register-dto';
import { UserStudentDTO } from '../models/User/user-student-dto';
import { UserLoginDTO } from '../models/User/user-login-dto';
import { ILoginData } from '../models/User/ilogin-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // baseUrl = `${environment.apiBaseUrl}${environment.endpoints.auth}`;
  baseUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  register(userInput: UserRegisterDTO): Observable<UserStudentDTO> {
    return this.http.post<UserStudentDTO>(
      `${this.baseUrl}/register`,
      userInput
    );
  }

  login(userLoginInput: UserLoginDTO | null): Observable<ILoginData> {
    return this.http.post<ILoginData>(`${this.baseUrl}/login`, userLoginInput);
  }
}
