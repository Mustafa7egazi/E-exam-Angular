export const environment = {
  production: false,
  apiPort: 7138,
  get apiBaseUrl() {
    return `http://localhost:${this.apiPort}/api`;
  },
  endpoints: {
    exam: '/exam',
    questions: '/Questions',
    subject: '/Subject',
    auth: '/auth',
    user: '/user',
  },
};
