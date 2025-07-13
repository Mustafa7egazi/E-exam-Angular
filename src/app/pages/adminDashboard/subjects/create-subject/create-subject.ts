import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectsService } from '../../../../services/subjects.service';
import { ISubject } from '../../../../models/Subject/ISubject';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-subject',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-subject.html',
  styleUrl: './create-subject.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateSubjectComponent implements OnInit, OnDestroy {
  subjectForm!: FormGroup;
  isLoading: boolean = false;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private subjectsService: SubjectsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      this.isLoading = true;

      const formValue = this.subjectForm.value;
      const subject: ISubject = {
        id: 0, // Will be assigned by the backend
        name: formValue.name.trim()
      };

      this.subscription.add(
        this.subjectsService.addSubject(subject).subscribe({
                  next: (response: ISubject) => {
          console.log('Subject created successfully:', response);
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Subject created successfully!');
          this.router.navigate(['/admin/questions']);
        },
        error: (error: any) => {
          console.error('Error creating subject:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Failed to create subject. Please try again.');
        }
        })
      );
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.subjectForm.controls).forEach(key => {
      const control = this.subjectForm.get(key);
      control?.markAsTouched();
    });
    this.cdr.markForCheck();
  }

  cancel(): void {
    this.router.navigate(['/admin/questions']);
  }
}
