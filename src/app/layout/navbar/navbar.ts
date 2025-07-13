import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { StorageService } from '../../services/storageservice';
import { ILoginData } from '../../models/User/ilogin-data';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  userData: ILoginData | null = null;
  userName: string = '';
  constructor(private storageService: StorageService, private router: Router) {}
  ngOnInit(): void {
    this.userData = this.storageService.getUser();
    this.userName = this.userData?.user?.name || '';
  }

  logout() {
    this.storageService.removeUser();
    this.storageService.removeToken();
    this.router.navigate(['/student/login']);
  }
}
