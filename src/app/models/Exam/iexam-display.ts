import { IQuestionDisplay } from "../Questions/iquestion-display";

export interface IExamDisplay {
  id: number;
  name: string;
  totalMarks: string;
  subject: string;
  isPublished: boolean;
  questionsCount: number;
  durationInMinites: number;
  questions: IQuestionDisplay[];
}
