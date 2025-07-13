import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentExamsService } from '../../../services/student-exams-service';
import { RouterLink } from '@angular/router';
import { ILoginData } from '../../../models/User/ilogin-data';
import { StorageService } from '../../../services/storageservice';

@Component({
  selector: 'app-stu-dashboard',
  imports: [RouterLink],
  templateUrl: './stu-dashboard.html',
  styleUrl: './stu-dashboard.css',
})
export class StuDashboard implements OnInit {
  availableStudentExams: any[] = [];
  takenExams: any[] = [];
  pendingExams: number = 0;
  userData: ILoginData | null = null;
  userName: string = '';

  constructor(
    private storageService: StorageService,
    private studentExamsService: StudentExamsService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.userData = this.storageService.getUser();
    this.userName = this.userData?.user?.name || '';
    this.studentExamsService.getStudentAvailableExams().subscribe({
      next: (data) => {
        this.availableStudentExams = data;
        console.log(this.availableStudentExams);
        this.cdr.detectChanges(); // Ensure the view updates with the new data
      },
      error: (error) => {
        console.error('Error fetching available exams:', error);
      },
    });

    this.studentExamsService.getAllTakenExams(1).subscribe({
      next: (data) => {
        this.takenExams = data;
        console.log(this.takenExams);
        this.pendingExams =
          this.availableStudentExams.length - this.takenExams.length;
        console.log(this.pendingExams);
        this.cdr.detectChanges(); // Ensure the view updates with the new data
      },
      error: (error) => {
        console.error('Error fetching taken exams:', error);
      },
    });
  }
}
