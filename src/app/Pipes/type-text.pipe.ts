import { Pipe, PipeTransform } from '@angular/core';
import { QuestionType } from '../models/Questions/IQuestions';

@Pipe({
  name: 'typeText'
})
export class TypeTextPipe implements PipeTransform {
  transform(value: QuestionType): string {
    return QuestionType[value];
  }
}
