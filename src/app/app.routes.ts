import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/notfound/notfound';
import { AdminAuth } from './pages/admin-auth/admin-auth';
import { StudentAuth } from './pages/student-auth/student-auth';
import { AdmDashboard } from './pages/adminDashboard/adm-dashboard/adm-dashboard';
import { StuDashboard } from './pages/studentDashboard/stu-dashboard/stu-dashboard';
import { ExamForm } from './pages/adminDashboard/exam-form/exam-form';
import { Exam } from './pages/studentDashboard/exam/exam';
import { ExamResults } from './pages/studentDashboard/exam-results/exam-results';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'admin/login', component: AdminAuth },
  { path: 'student/login', component: StudentAuth },
  { path: 'student/register', component: StudentAuth },
  { path: 'admin/dashboard', component: AdmDashboard },
  { path: 'admin/exam', component: ExamForm },
  { path: 'student-dashboard', component: StuDashboard },
  { path: 'student/exams/:id', component: Exam },
  { path: 'student/exam-results', component: ExamResults },
  { path: '**', component: NotFound },
];
