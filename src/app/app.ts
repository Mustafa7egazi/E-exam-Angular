import { Component } from '@angular/core';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { RouterOutlet } from '@angular/router';
import { StuDashboard } from './pages/studentDashboard/stu-dashboard/stu-dashboard';

@Component({
  selector: 'app-root',
  imports: [Navbar, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'E_exam_Angular';
}
