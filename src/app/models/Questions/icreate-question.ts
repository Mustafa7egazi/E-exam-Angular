import { ICreateOption } from '../Option/icreate-option';
import { QuestionType, DifficultyLevel } from './IQuestions';
export interface ICreateQuestion {
 title: string;
  score: number;
  type: QuestionType;
  difficulty: DifficultyLevel;
  subjectId: number;
  options: ICreateOption[];
}
