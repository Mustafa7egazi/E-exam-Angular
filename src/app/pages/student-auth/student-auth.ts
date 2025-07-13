import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangeDetectorRef, Component } from '@angular/core';
import { UserRegisterDTO } from '../../models/User/user-register-dto';
import { AuthService } from '../../services/auth-service';
import { UserLoginDTO } from '../../models/User/user-login-dto';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storageservice';

@Component({
  standalone: true,
  selector: 'app-student-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './student-auth.html',
  styleUrls: ['./student-auth.css'],
})
export class StudentAuth {
  userInput!: UserRegisterDTO;
  userLoginInput!: UserLoginDTO;

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    dateOfBirth: new FormControl<Date | null>(
      new Date(2000, 1, 1),
      Validators.required
    ),
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    confirmPassword: new FormControl<string>('', Validators.required),
    // firstName: new FormControl<string>(''),
    // lastName: new FormControl<string>(''),
    // dateOfBirth: new FormControl<Date>(new Date(2000, 0, 1)),
    // email: new FormControl<string>('',),
    // password: new FormControl<string>('',),
    // confirmPassword: new FormControl<string>('',)
  });

  loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    private chr: ChangeDetectorRef
  ) {}

  onSubmitRegister() {
    if (this.registerForm.valid) {
      this.userInput = this.registerForm.value;
      this.authService.register(this.userInput).subscribe({
        next: (response) => {
          // Handle successful registration, e.g., navigate to login page or show a success message
          this.chr.detectChanges();
          this.router.navigate(['/student-auth/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      this.userLoginInput = this.loginForm.value;
      this.authService.login(this.userLoginInput).subscribe({
        next: (response) => {
          this.storageService.setUser(response);
          // Save token to cookie (assuming response is the token string)
          this.storageService.setToken(response.token);
          // Navigate to student dashboard
          this.router.navigate(['/student-dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
