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
  // id: number;
  // name: string;
  // totalMarks: number;
  // durationInMinites: number;
  // passMark: number;
  // isPublished: boolean;
  // subjectId: number;
  // teacherId: number;
  // examQuestions: number[];
