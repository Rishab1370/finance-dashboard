# Personal Finance Dashboard

A fully client-side React application that allows users to track income, expenses, savings, and budgets through an interactive and visually engaging interface. No backend or authentication is required — all data is persisted using localStorage.

## Features

- **Summary Cards**: Track total Income, Expense, Savings, and Net Balance in real-time.
- **Transaction Management**: Add, edit, delete, and filter transactions by category or search term.
- **Data Visualization**: Interactive Donut and Bar charts using Recharts for dynamic insights.
- **Budget Tracker**: Set monthly limits per category and track spending progress.
- **Dark Mode**: Fully supported dark/light theme switching.
- **CSV Export**: Export all transactions to CSV format with a single click.
- **Local Persistence**: Data securely persists entirely in your browser using `localStorage`.

## Tech Stack

- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Utils**: date-fns, uuid

## Getting Started

1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

Deploy this project easily using Vercel. With zero backend dependencies, you can deploy the `dist/` directory or link your GitHub repository directly to Vercel for automatic deployments on push.
