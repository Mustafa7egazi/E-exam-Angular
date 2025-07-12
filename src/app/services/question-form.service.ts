import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { QuestionType, DifficultyLevel } from '../models/Questions/IQuestions';

@Injectable({
  providedIn: 'root',
})
export class QuestionFormService {
  constructor(private fb: FormBuilder) {}

  createQuestionForm() {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      score: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      type: [QuestionType.MultipleChoice, Validators.required],
      difficulty: [DifficultyLevel.Easy, Validators.required],
      subjectId: [null, Validators.required],
      options: this.fb.array([]),
    });
  }

  createOptionForm(title: string = '', isCorrect: boolean = false) {
    return this.fb.group({
      title: [title, [Validators.required, this.duplicateOptionValidator()]],
      isCorrect: [isCorrect],
    });
  }

  duplicateOptionValidator() {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }

      const currentValue = control.value.trim().toLowerCase();
      const optionsArray = control.parent?.parent as FormArray;

      if (!optionsArray) {
        return null;
      }

      const currentIndex = optionsArray.controls.indexOf(control.parent!);

      for (let i = 0; i < optionsArray.length; i++) {
        if (i !== currentIndex) {
          const otherOption = optionsArray.at(i);
          const otherValue = otherOption
            .get('title')
            ?.value?.trim()
            .toLowerCase();
          if (otherValue === currentValue) {
            return { duplicate: true };
          }
        }
      }

      return null;
    };
  }

  setupOptionValidation(optionsArray: FormArray): void {
    optionsArray.controls.forEach((control) => {
      const titleControl = control.get('title');
      if (titleControl) {
        titleControl.setValidators([
          Validators.required,
          this.duplicateOptionValidator(),
        ]);
        titleControl.updateValueAndValidity();
      }
    });
  }

  clearOptionsArray(optionsArray: FormArray): void {
    while (optionsArray.length > 0) {
      optionsArray.removeAt(0);
    }
  }

  addTrueFalseOptions(optionsArray: FormArray): void {
    // Clear any existing options first
    this.clearOptionsArray(optionsArray);

    const trueOption = this.createOptionForm('True', false);
    const falseOption = this.createOptionForm('False', false);

    optionsArray.push(trueOption);
    optionsArray.push(falseOption);
    this.setupOptionValidation(optionsArray);
  }

  addDefaultMultipleChoiceOptions(optionsArray: FormArray): void {
    const option1 = this.createOptionForm('', false);
    const option2 = this.createOptionForm('', false);
    const option3 = this.createOptionForm('', false);

    optionsArray.push(option1);
    optionsArray.push(option2);
    optionsArray.push(option3);
    this.setupOptionValidation(optionsArray);
  }

  handleQuestionTypeChange(
    questionType: QuestionType,
    optionsArray: FormArray
  ): void {
    this.clearOptionsArray(optionsArray);

    if (questionType == QuestionType.TrueFalse) {
      this.addTrueFalseOptions(optionsArray);
    } else {
      this.addDefaultMultipleChoiceOptions(optionsArray);
    }
  }

  ensureSingleCorrectOption(
    optionsArray: FormArray,
    selectedIndex: number
  ): void {
    optionsArray.controls.forEach((control, index) => {
      if (index !== selectedIndex) {
        control.get('isCorrect')?.setValue(false);
      } else {
        control.get('isCorrect')?.setValue(true);
      }
    });
  }
}
