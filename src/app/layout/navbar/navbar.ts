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
  storedDate: ILoginData | null = null;
  constructor(private storageService: StorageService, private router: Router) {}
  ngOnInit(): void {
    this.storedDate = this.storageService.getUser();
  }
  logout() {
    this.storageService.removeUser();
    this.storageService.removeToken();
    this.router.navigate(['/student/login']);
  }
}
