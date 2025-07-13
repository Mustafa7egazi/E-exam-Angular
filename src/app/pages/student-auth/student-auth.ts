import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserRegisterDTO } from '../../models/User/user-register-dto';
import { AuthService } from '../../services/auth-service';
import { UserLoginDTO } from '../../models/User/user-login-dto';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storageservice';

@Component({
  standalone: true,
  selector: 'app-student-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './student-auth.html',
  styleUrls: ['./student-auth.css'],
})
export class StudentAuth implements OnInit {
  userInput!: UserRegisterDTO;
  userLoginInput!: UserLoginDTO;
  showRegisterForm: boolean = false;

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
  });

  loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private chr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Check if current route is /student/register
    const currentUrl = this.router.url;
    if (currentUrl === '/student/register') {
      this.showRegisterForm = true;
      // Use setTimeout to ensure DOM is ready before switching tabs
      setTimeout(() => {
        this.switchToRegisterForm();
      }, 100);
      return;
    }

    // Check navigation state to see if register form should be shown
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.showRegisterForm = navigation.extras.state['showRegisterForm'] || false;
      if (this.showRegisterForm) {
        // Use setTimeout to ensure DOM is ready before switching tabs
        setTimeout(() => {
          this.switchToRegisterForm();
        }, 100);
      }
    }
  }

  switchToRegisterForm(): void {
    // Remove active class from login tab and add to register tab
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginContent = document.getElementById('login');
    const registerContent = document.getElementById('register');

    if (loginTab && registerTab && loginContent && registerContent) {
      loginTab.classList.remove('active');
      registerTab.classList.add('active');
      loginContent.classList.remove('show', 'active');
      registerContent.classList.add('show', 'active');
    }
  }

  switchToLoginForm(): void {
    // Remove active class from register tab and add to login tab
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginContent = document.getElementById('login');
    const registerContent = document.getElementById('register');

    if (loginTab && registerTab && loginContent && registerContent) {
      registerTab.classList.remove('active');
      loginTab.classList.add('active');
      registerContent.classList.remove('show', 'active');
      loginContent.classList.add('show', 'active');
    }
  }

  onSubmitRegister() {
    if (this.registerForm.valid) {
      this.userInput = this.registerForm.value;
      this.authService.register(this.userInput).subscribe({
        next: (response) => {
          // Handle successful registration, e.g., navigate to login page or show a success message
          this.chr.detectChanges();
          this.router.navigate(['student/login']);
        },
        error: (error) => {
          console.log(this.userInput);
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
