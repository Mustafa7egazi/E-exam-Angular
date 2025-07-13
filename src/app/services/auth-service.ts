import { Injectable } from '@angular/core';
import { environment } from '../enviroment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegisterDTO } from '../models/User/user-register-dto';
import { UserStudentDTO } from '../models/User/user-student-dto';
import { UserLoginDTO } from '../models/User/user-login-dto';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  baseUrl = `${environment.apiBaseUrl}${environment.endpoints.auth}`;

  constructor(private http: HttpClient) { }

  register(userInput: UserRegisterDTO): Observable<UserStudentDTO> {
    return this.http.post<UserStudentDTO>(`${this.baseUrl}/register`, userInput);
  }

  login(userLoginInput: UserLoginDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, userLoginInput, { responseType: 'text' });
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token) return true;
    return false;
  }

  getDecodedToken(): any {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return jwtDecode(token);
  }

  getUserId(): string | null {
    return this.getDecodedToken()?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
  }

  getUserEmail(): string | null {
    return this.getDecodedToken()?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null;
  }

  getUserRole(): string | null {
    return this.getDecodedToken()?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  getFirstName(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.FirstName || null;
  }

  getLastName(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.LastName || null;
  }

  getFullName(): string | null {
    const decoded = this.getDecodedToken();
    return decoded ? `${decoded.FirstName} ${decoded.LastName}` : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isStudent(): boolean {
    return this.getUserRole() === 'student';
  }

  // For student-specific claims
  getStudentId(): string | null {
    return this.getDecodedToken()?.StudentId || null;
  }

  getDateOfBirth(): Date | null {
    const dob = this.getDecodedToken()?.DateOfBirth;
    return dob ? new Date(dob) : null;
  }

  // For teacher-specific claims
  getTeacherId(): string | null {
    return this.getDecodedToken()?.TeacherId || null;
  }
}
