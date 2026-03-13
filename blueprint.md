
# Project Blueprint: Strategic KPI Dashboard

## 1. Project Overview

This project is a web-based KPI (Key Performance Indicator) dashboard designed to provide a strategic overview of a company's performance across three key areas: Buyers, Users, and Investors. The dashboard displays a variety of KPIs in a visually organized and interactive manner, allowing users to quickly assess the health of the business and delve into the details of each metric.

## 2. Technologies Used

- **Frontend:**
    - **React:** The core of the application is built using React, a popular JavaScript library for building user interfaces.
    - **Vite:** The project is set up with Vite, a modern and fast build tool for web development.
    - **Tailwind CSS:** The application is styled with Tailwind CSS, a utility-first CSS framework for creating custom designs.
    - **Recharts:** The application uses Recharts to create interactive and customizable charts for visualizing historical KPI data.
    - **react-markdown:** The application uses react-markdown to display the AI-generated report.
- **Backend (for future integration):**
    - **Firebase:** The project is set up to use Firebase for user authentication, data storage, and backend functions.
    - **Google Gemini:** The project uses the Gemini API to generate AI-powered reports based on the selected KPIs.

## 3. File Structure

```
/src
├── assets
│   └── adarga.png
├── components
│   ├── KpiCard.jsx
│   ├── KpiModal.jsx
│   └── ReportModal.jsx
├── data
│   ├── api.js
│   └── mockKpis.js
├── utils
│   └── formatting.js
├── App.jsx
├── firebase.js
├── index.css
└── main.jsx
```

- **`src/assets`**: Contains static assets, such as images.
- **`src/components`**: Contains the reusable React components used in the application.
- **`src/data`**: Contains the data sources for the application, including the mock data and the API for fetching live data.
- **`src/utils`**: Contains utility functions that can be used throughout the application.
- **`src/App.jsx`**: The main component of the application, which orchestrates the layout and functionality of the dashboard.
- **`src/firebase.js`**: Contains the Firebase configuration and initialization code.
- **`src/index.css`**: The main stylesheet for the application.
- **`src/main.jsx`**: The entry point of the application.

## 4. Component Breakdown

- **`KpiCard.jsx`**: A reusable component that displays a single KPI. It includes the KPI's title, value, target, and change over time. It also includes a tooltip that shows the KPI's formula.
- **`KpiModal.jsx`**: A modal component that displays a historical chart of a selected KPI. It uses Recharts to render the chart and includes a forecast line to show the predicted future trend.
- **`ReportModal.jsx`**: A modal component that displays an AI-generated report based on the selected KPIs. It uses the Gemini API to generate the report and displays it in a formatted way using react-markdown.

## 5. Data Flow

The application currently uses mock data from `src/data/mockKpis.js` to populate the KPI dashboard. This data is imported into the `App.jsx` component and passed down to the `KpiCard` components.

The application is also set up to fetch live data from a Firebase backend. The `src/data/api.js` file contains the functions for fetching this data, but they are not currently being used. The plan is to replace the mock data with live data in the future.

## 6. Future Integration

- **Firebase Data:** The application will be updated to fetch live data from a Firebase backend. This will involve updating the `App.jsx` component to call the functions in `src/data/api.js` and updating the Firebase backend to provide the necessary data.
- **User Authentication:** The application will be updated to include user authentication. This will allow users to save their dashboard configurations and access their data from any device.
- **Real-time Updates:** The application will be updated to provide real-time updates to the KPI data. This will involve using Firebase's real-time database to push updates to the client as they happen.
