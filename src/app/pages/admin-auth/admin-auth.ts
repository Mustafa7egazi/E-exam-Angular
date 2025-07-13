import { ChangeDetectorRef, Component } from '@angular/core';
import { UserLoginDTO } from '../../models/User/user-login-dto';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { StorageService } from '../../services/storageservice';

@Component({
  selector: 'app-admin-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-auth.html',
  styleUrl: './admin-auth.css',
})
export class AdminAuth {
  userLoginInput!: UserLoginDTO;

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
  onSubmitLogin() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.userLoginInput = this.loginForm.value;
      this.authService.login(this.userLoginInput).subscribe({
        next: (response) => {
          console.log(response);
          this.storageService.setUser(response);
          // Save token to cookie (assuming response is the token string)
          this.storageService.setToken(response.token);
          // Navigate to teacher dashboard
          this.router.navigate(['/admin/dashboard']);
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
