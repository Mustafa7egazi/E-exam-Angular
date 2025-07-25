import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/notfound/notfound';
import { AdminAuth } from './pages/admin-auth/admin-auth';
import { StudentAuth } from './pages/student-auth/student-auth';
import { AdmDashboard } from './pages/adminDashboard/adm-dashboard/adm-dashboard';
import { StuDashboard } from './pages/studentDashboard/stu-dashboard/stu-dashboard';
import { ExamForm } from './pages/adminDashboard/exam-form/exam-form';
import { CreateSubjectComponent } from './pages/adminDashboard/subjects/create-subject/create-subject';
import { QuestionMainSection } from './pages/adminDashboard/questions/question-main-section/question-main-section';
import { CreateQuestionComponent } from './pages/adminDashboard/questions/create-question/create-question';
import { EditQuestionComponent } from './pages/adminDashboard/questions/edit-question/edit-question';
import { ExamResults } from './pages/studentDashboard/exam-results/exam-results';
import { Exam } from './pages/studentDashboard/exam/exam';
import { AdminGuard, StudentGuard } from './services/auth-service';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'admin/login', component: AdminAuth },
  { path: 'student/login', component: StudentAuth },
  { path: 'student/register', component: StudentAuth },
  {
    path: 'admin/dashboard',
    component: AdmDashboard,
    canActivate: [AdminGuard],
  },
  { path: 'admin/exam', component: ExamForm, canActivate: [AdminGuard] },
  {
    path: 'admin/exams/edit/:id',
    component: ExamForm,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/questions',
    component: QuestionMainSection,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/questions/create',
    component: CreateQuestionComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/questions/edit/:id',
    component: EditQuestionComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/subjects/create',
    component: CreateSubjectComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'student-dashboard',
    component: StuDashboard,
    canActivate: [StudentGuard],
  },
  { path: 'student/exams/:id', component: Exam, canActivate: [StudentGuard] },
  {
    path: 'student/exam-results',
    component: ExamResults,
    canActivate: [StudentGuard],
  },
  { path: '**', component: NotFound },
];
