export interface IExamList {
  id: number;
  name: string;
  totalMarks: number;
  subject: string;
  isPublished: boolean;
  questionsCount: number;
  durationInMinites: number;
}

export interface IExamDetails {
  id: number;
  name: string;
  totalMarks: number;
  subject: string;
  isPublished: boolean;
  durationInMinites: number;
  questionsCount: number;
  questions: IExamQuestion[];
}

export interface IExamQuestion {
  id: number;
  title: string;
  score: number;
  type: number;
  difficulty: number;
  subjectId: number;
  subjectName: string;
  options: IQuestionOption[];
}

export interface IQuestionOption {
  id: number;
  title: string;
  isCorrect: boolean;
  questionId: number;
}

export interface IExamAnswer {
  questionId: number;
  selectedOptionId: number;
}
