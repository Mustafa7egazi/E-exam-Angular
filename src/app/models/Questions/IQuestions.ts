import { IOption } from '../Option/Ioption';
export enum DifficultyLevel {
  Easy,
  Medium,
  Hard
}

export enum QuestionType {
  MultipleChoice,
  TrueFalse
}

export interface IQuestion {
  id: number;
  title: string;
  score: number;
  type: QuestionType;
  difficulty: DifficultyLevel;
  subjectId: number;
  subjectName: string;
  options: IOption[];
}
