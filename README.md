# LeetLabs
![Black   White Minimalist Business Logo (2)](https://github.com/user-attachments/assets/3bf0d8e7-ffbc-4cab-9963-03b8b4e2aa13)


**LeetLabs is a comprehensive, modern platform designed for developers and coding enthusiasts to practice problem-solving, track their progress, explore learning roadmaps, manage personalized problem sheets, and engage with an AI-powered coding assistant.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Shreyansh-Geek/LeetLabs?style=social)](https://github.com/Shreyansh-Geek/LeetLabs)
[![GitHub forks](https://img.shields.io/github/forks/Shreyansh-Geek/LeetLabs?style=social)](https://github.com/Shreyansh-Geek/LeetLabs)


## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Project](#running-the-project)
  - [Client (Frontend)](#client-frontend)
  - [Server (Backend)](#server-backend)
- [Environment Variables](#environment-variables)
- [API Endpoints Overview](#api-endpoints-overview)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## About The Project

LeetLabs aims to be the ultimate companion for anyone looking to enhance their coding skills, prepare for technical interviews, or simply enjoy the challenge of algorithmic problem-solving. It provides a rich user experience with a dedicated workspace, personalized tracking, curated learning paths, and community features. The integration of an AI assistant offers on-demand help and discussion, making learning more interactive and efficient.

![image](https://github.com/user-attachments/assets/17914df3-574a-40fa-a5ba-5b13dc350dce)

## Key Features

*   **User Authentication:** Secure Sign-up, Login, Email Verification, Forgot/Reset Password.
*   **Problem Solving:**
    *   Extensive library of coding problems with filtering (difficulty, tags, status).
    *   Dedicated workspace with a code editor, problem description, test cases, and editorial sections.
    *   Code submission and real-time evaluation (powered by Judge0).
    *   Personal notes per problem.
*   **AI-Powered Assistance:**
    *   AI Discussions for problems, providing hints, explanations, and alternative approaches.
*   **Personalized Sheets:**
    *   Create and manage custom problem sheets (e.g., "Grind 75", "Google SDE-2 ").
    *   Track progress on sheets.
    *   Browse public sheets created by the community.
*   **User Profile & Dashboard:**
    *   Comprehensive overview of user activity: activity heatmap, difficulty distribution chart, progress chart.
    *   Skills radar, recent activity log, submissions history.
    *   Quick actions and stat cards for key metrics.
*   **Learning Roadmaps:** Curated roadmaps for various domains (Frontend, Backend, DSA, ML, etc.) to guide learning.
*   **Blogs:** Read and filter articles on various tech topics (potentially integrated with Hashnode).
*   **Glossary:** A handy glossary for quick lookup of technical terms.
*   **Contribution System:** Allows users to contribute problems or other content.
*   **Modern UI/UX:** Built with Tailwind CSS and shadcn/ui for a sleek and intuitive interface.


## Screenshots

A picture is worth a thousand words! Here are some glimpses into LeetLabs:

1.  **Landing Page:**
    ![image](https://github.com/user-attachments/assets/32c910a5-e66d-4c35-879d-f9851729a31b)

    
3.  **Problems Page:**
    ![image](https://github.com/user-attachments/assets/5ed732df-5996-491d-930e-2e6f2493a417)


4.  **Problem Workspace:**
    ![image](https://github.com/user-attachments/assets/17914df3-574a-40fa-a5ba-5b13dc350dce)
    ![image](https://github.com/user-attachments/assets/e7a05536-f432-4c59-9983-98d7920ced22)  


5.  **User Profile Dashboard:**
    ![image](https://github.com/user-attachments/assets/1b7a211b-0d6e-4145-bfdb-c06bc2ad4d18)
    ![image](https://github.com/user-attachments/assets/c4ff2aa0-83e4-493d-b3f1-053a99abe1cd)
    ![image](https://github.com/user-attachments/assets/e1a0a371-609c-431e-84eb-2c4edf84d210)


6.  **Roadmaps Page:**
    ![image](https://github.com/user-attachments/assets/cd39b251-e0fc-48ae-b067-700b33c2ed9a)
    ![image](https://github.com/user-attachments/assets/555c6984-1a50-4d87-a3e2-7fa8db286a9b)


7.  **Blogs Page:**
    ![image](https://github.com/user-attachments/assets/51b3c24b-61c1-4fdb-a16e-0361ab56242b)


8.  **My Sheets Page:**
    ![image](https://github.com/user-attachments/assets/d080222f-ad24-44f2-a426-b1e0478d537b)

    
9.  **AI Discussion Interface:**
    ![image](https://github.com/user-attachments/assets/2875d562-451b-4ece-8590-1bbc923a1b29)

## Tech Stack

### Frontend (Client)

*   **Framework/Library:** React.js
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui majorly
*   **Routing:** React Router
*   **State Management:**  React Context API and custom Hooks
*   **Linting:** ESLint

### Backend (Server)

*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Database ORM:** Prisma
*   **Authentication:** JWT (JSON Web Tokens)
*   **Code Execution Service:** Judge0 inhouse self hosted (for evaluating submissions)
*   **Email Service:** Nodemailer (for email verification, password resets)
*   **Blog Integration:** Hashnode GraphQL API 

### Database

*   **Database System:** PostgreSQL (implied by typical Prisma usage)

### Development & Deployment

*   **Version Control:** Git & GitHub
*   **Package Managers:** npm 

## Folder Structure
A high-level overview of the project's organization:
```
LeetLabs/
├── client/                   # Frontend codebase
│   ├── public/               # Static assets (e.g., favicon)
│   ├── src/
│   │   ├── assets/           # Images, fonts, and icons for companies, languages, and roadmaps
│   │   ├── components/       # Reusable React components (e.g., Navbar, CodeEditor, BlogCard)
│   │   ├── lib/              # Utility functions for auth, problems, and workspace
│   │   ├── pages/            # Page components (e.g., LandingPage, ProblemsPage)
│   │   ├── routes/           # Frontend routing configuration
│   │   ├── App.jsx           # Main React app component
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Entry point for frontend
│   ├── .env                  # Frontend environment variables
│   ├── package.json          # Frontend dependencies and scripts
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── vite.config.js        # Vite configuration
├── server/                   # Backend codebase
│   ├── prisma/               # Database schema and migrations
│   │   ├── migrations/       # Prisma migration files for database models
│   │   ├── schema.prisma     # Prisma schema definition
│   │   ├── seed.js           # Database seeding script
│   │   └── seed-glossary.js  # Glossary seeding script
│   ├── src/
│   │   ├── controllers/      # API logic for auth, problems, blogs, etc.
│   │   ├── middlewares/      # Authentication middleware
│   │   ├── routes/           # API routes for various features
│   │   ├── utils/            # Helper functions (e.g., Judge0, mailer)
│   │   └── index.js          # Backend entry point
│   ├── .env                  # Backend environment variables
│   └── package.json          # Backend dependencies and scripts
├── .gitignore                # Ignored files and directories
├── LICENSE                   # Project license
└── README.md                 # Project documentation
```

## Acknowledgements
* shadcn/ui, AceternityUI and MagicUI for the fantastic UI components.
* Tailwind CSS
* React
* Node.js & Express.js
* Prisma
* Judge0 for the robust code execution engine.
* tinymce
* Spline
* And all other libraries or services we've used significantly.
* Inspiration from platforms like LeetCode and HackerRank

