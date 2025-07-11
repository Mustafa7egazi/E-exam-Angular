import { Pipe, PipeTransform } from '@angular/core';
import { DifficultyLevel } from '../models/Questions/IQuestions';

@Pipe({
  name: 'difficultyText'
})
export class DifficultyTextPipe implements PipeTransform {
  transform(value: DifficultyLevel): string {
    return DifficultyLevel[value];
  }
}
