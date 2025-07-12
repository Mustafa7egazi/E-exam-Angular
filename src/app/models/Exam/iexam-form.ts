export interface IExamForm {
  id: number;
  name: string;
  totalMarks: number;
  durationInMinites: number;
  passMark: number;
  isPublished: boolean;
  subjectId: number;
  teacherId: number;
  examQuestions: number[];
}
