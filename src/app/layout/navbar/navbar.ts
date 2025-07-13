import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class Navbar implements OnInit, OnDestroy {
  userData: ILoginData | null = null;
  userName: string = '';
  private userSub: any;
  constructor(private storageService: StorageService, private router: Router) {}
  ngOnInit(): void {
    this.userSub = this.storageService.user$.subscribe((user) => {
      this.userData = { token: '', user };
      this.userName = user?.name || '';
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  logout() {
    this.storageService.removeUser();
    this.storageService.removeToken();
    this.router.navigate(['/student/login']);
  }
}
