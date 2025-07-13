import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegisterDTO } from '../models/User/user-register-dto';
import { UserStudentDTO } from '../models/User/user-student-dto';
import { UserLoginDTO } from '../models/User/user-login-dto';
import { ILoginData } from '../models/User/ilogin-data';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { StorageService } from './storageservice';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   baseUrl = `${environment.apiBaseUrl}${environment.endpoints.auth}`;
  //baseUrl = 'http://localhost:5000/api/auth';

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

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user = this.storageService.getUser();
    if (user && user.user && user.user.role === 'admin') {
      return true;
    } else {
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
}

@Injectable({ providedIn: 'root' })
export class StudentGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user = this.storageService.getUser();
    if (user && user.user && user.user.role === 'student') {
      return true;
    } else {
      this.router.navigate(['/student/login']);
      return false;
    }
  }
}
