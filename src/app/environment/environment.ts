export const environment = {
  production: false,
  apiPort: 5000,
  get apiBaseUrl() {
    return `http://localhost:${this.apiPort}/api`;
  },
  endpoints: {
    exam: '/exam',
    questions: '/Questions',
    subject: '/Subject',
  },
};
