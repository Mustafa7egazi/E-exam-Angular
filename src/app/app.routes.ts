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

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'admin/login', component: AdminAuth },
  { path: 'student/login', component: StudentAuth },
  { path: 'student/register', component: StudentAuth },
  { path: 'admin/dashboard', component: AdmDashboard },
  { path: 'admin/exam', component: ExamForm },
  { path: 'student-dashboard', component: StuDashboard },
  { path: 'admin/questions', component: QuestionMainSection },
  { path: 'admin/questions/create', component: CreateQuestionComponent },
  { path: 'admin/questions/edit/:id', component: EditQuestionComponent },
  { path: 'admin/subjects/create', component: CreateSubjectComponent },
  { path: '**', component: NotFound },
];
