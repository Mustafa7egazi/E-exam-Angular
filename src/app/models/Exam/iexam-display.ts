import { IQuestionDisplay } from "../Questions/iquestion-display";
import { IExamQuestion } from "./iexam-list";

export interface IExamDisplay {
  id: number;
  name: string;
  totalMarks: number;
  subject: string;
  isPublished: boolean;
  questionsCount: number;
  durationInMinites: number;
  questions: IExamQuestion[];
}
