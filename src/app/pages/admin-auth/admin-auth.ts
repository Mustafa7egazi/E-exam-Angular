import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRegisterDTO } from '../../models/User/user-register-dto';
import { AuthService } from '../../services/auth-service';
import { UserLoginDTO } from '../../models/User/user-login-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-auth.html',
  styleUrl: './admin-auth.css',
})
export class AdminAuth {
  userInput!: UserRegisterDTO;
  userLoginInput!: UserLoginDTO;

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    dateOfBirth: new FormControl<Date | null>(new Date(2000, 1, 1), Validators.required),
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    confirmPassword: new FormControl<string>('', Validators.required)
  });

  loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    role: new FormControl<string>('admin', Validators.required)
  });

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  onSubmitRegister() {
    if (this.registerForm.valid) {
      this.userInput = this.registerForm.value;
      console.log('Register Form Submitted!', this.userInput);
      this.authService.register(this.userInput).subscribe({
        next: (response) => {
          console.log('Registration successful, this is the api response (UserStudentDTO object): ', response);
          this.cdr.detectChanges();
          this.router.navigate(['/admin/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      this.userLoginInput = this.loginForm.value;
      console.log('Login Form Submitted!', this.userLoginInput);
      this.authService.login(this.userLoginInput).subscribe({
        next: (response) => {
          console.log('Login successful, this is the api response (token): ', response);
          localStorage.setItem('token', response);
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
