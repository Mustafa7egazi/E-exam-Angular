export interface ILoginData {
  token: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
}
