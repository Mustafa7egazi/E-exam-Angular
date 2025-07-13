import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { StorageService } from '../../services/storageservice';
import { ILoginData } from '../../models/User/ilogin-data';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  userData: ILoginData | null = null;

  constructor(private storageService: StorageService, private router: Router) {
    this.userData = this.storageService.getUser();
  }

  navigateToRegister(): void {
    this.router.navigate(['/student/register']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/student/login'], {
      state: { showRegisterForm: false },
    });
  }
}
