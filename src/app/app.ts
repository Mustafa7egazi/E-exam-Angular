import { Component } from '@angular/core';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { AdminAuth } from './pages/admin-auth/admin-auth';

@Component({
  selector: 'app-root',
  imports: [Navbar, Footer, AdminAuth],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'E_exam_Angular';
}
