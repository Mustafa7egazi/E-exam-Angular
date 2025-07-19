# E-Exam Management System - Frontend (Angular)

This repository hosts the frontend application for the E-Exam Management System, built with Angular. It provides the user interface for interacting with the backend API (found in the [E-exam-API repository](https://github.com/Mustafa7egazi/E-exam-API)).

This project was developed as a contribution during an Intensive Training Program at ITI, focusing on creating a responsive and intuitive user experience for managing online examinations.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Development Server](#development-server)
- [Code Scaffolding](#code-scaffolding)
- [Build](#build)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Project Overview

The E-Exam Management System frontend is an Angular single-page application (SPA) that provides the user-facing interface for the entire system. It communicates with the E-Exam API to perform operations such as user authentication, exam browsing, question display, answer submission, and result viewing.

Its goal is to offer a seamless and efficient experience for students taking exams, and for teachers/administrators managing exam content and users.

## Features

The Angular frontend enables users to:

- **User Authentication:** Log in as a Student, Teacher, or Administrator.
- **Student Dashboard:** View available exams, upcoming exams, and past results.
- **Exam Taking Interface:** A dynamic interface for attempting exams, displaying questions, and managing answer selections.
- **Result Viewing:** Review detailed exam results, including correct/incorrect answers and scores.
- **Teacher/Admin Functionality:** (Expected, based on API) Interfaces for creating exams, managing questions, subjects, and users.
- **Responsive Design:** Accessible across various devices (desktops, tablets, mobile phones).

## Technologies Used

- **Framework:** Angular (v20.0.1 or similar, generated with Angular CLI)
- **Languages:** TypeScript, HTML, CSS
- **Package Manager:** npm

## Project Structure

The project follows the standard Angular CLI directory structure:

```
E-exam-Angular/
├── .vscode/                    # Visual Studio Code specific settings
├── public/                     # Static assets (e.g., favicon.ico, index.html)
├── src/                        # Main application source code
│   ├── app/                    # Contains the root module, components, services, and routing
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # Data fetching and business logic services
│   │   ├── modules/            # Feature modules (if any)
│   │   ├── app-routing.module.ts # Routing configuration
│   │   ├── app.component.ts    # Root component logic
│   │   ├── app.component.html  # Root component template
│   │   ├── app.component.css   # Root component styles
│   ├── assets/                 # Static assets (images, fonts, etc.)
│   ├── environments/           # Environment-specific configs
│   ├── index.html              # Main HTML entry point
│   ├── main.ts                 # App bootstrap entry
│   ├── polyfills.ts            # Browser compatibility
│   ├── styles.css              # Global styles
├── angular.json                # Angular CLI config
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript compiler options
├── README.md                   # This README file
└── ...
```

## Getting Started

To run this frontend application locally:

> **Note:** The backend API must also be running. See [E-exam-API](https://github.com/Mustafa7egazi/E-exam-API)

### Prerequisites

- **Node.js:** [Install Node.js](https://nodejs.org/en/download/)
- **npm:** Comes with Node.js
- **Angular CLI:** Install globally:
  ```bash
  npm install -g @angular/cli
  ```

### Installation

```bash
git clone https://github.com/Mustafa7egazi/E-exam-Angular.git
cd E-exam-Angular
npm install
```

### Running the Application

1. Start the backend server
2. Run the frontend:
   ```bash
   ng serve
   ```
   Then open `http://localhost:4200` in your browser.

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will auto-reload if source files change.

## Code Scaffolding

To generate components, services, modules, etc. use Angular CLI:

```bash
ng generate component component-name
ng generate service service-name
```

## Build

To build the project:

```bash
ng build
```
Build artifacts will be stored in the `dist/` directory.


## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/MyFeature`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push: `git push origin feature/MyFeature`
5. Open a Pull Request

## License

This project is open-source. Check the repository for license info.

## Acknowledgements

- **ITI (Information Technology Institute)** – for the training opportunity
- **Angular Community** – for resources and tooling
