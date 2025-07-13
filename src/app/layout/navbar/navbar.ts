import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggedIn!: boolean;
  userFullName: string | null = null;
  userRole: string | null = null;
  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.userFullName = this.authService.getFullName();
    this.userRole = this.authService.getUserRole();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.cdr.detectChanges();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }
}
