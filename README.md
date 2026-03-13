# Adarga KPI Dashboard

This is a strategic KPI (Key Performance Indicator) dashboard designed to give a comprehensive overview of a company's performance, using Adarga as a case-study. The dashboard is organized into three main categories: Buyers, Users, and Investors.

## Core Features:

- Interactive KPI Cards: The main interface consists of cards, each representing a single KPI. These cards display the KPI's title, current value, target value, and the change over a period. They also include a tooltip explaining the KPI's formula.
- Historical Data Modal: When you click on a KPI card, a modal window appears, showing a historical chart of that KPI's performance over time. This chart, rendered using Recharts, also includes a forecast line to predict future trends.
- AI-Generated Reports: The application has a feature to generate an AI-powered report based on selected KPIs. This is done using the Gemini API, and the report is displayed in a modal using react-markdown.

## Technology Stack:

Frontend: The application is built with a modern frontend stack:
- **React**: The core UI library.
- **Vite**: A fast build tool for web development.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Recharts**: For creating interactive charts.
- **react-markdown**: To display the AI-generated reports.

Backend:
- **Firebase**: The project is set up to eventually use Firebase for features like user authentication, data storage, and backend functions.
- **Google Gemini**: The application is already using the Gemini API for its AI-powered reporting feature.

Data:

- Currently, the application uses mock data to populate the dashboard.
- There are plans to integrate a live Firebase backend to fetch real-time data.
