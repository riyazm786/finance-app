# Finance & Salary Management Web Application

A full-stack MERN web application to track monthly salary and expenses with a sleek, vibrant "Glassmorphism" UI.

## Features
- **Authentication**: JWT based user login & registration.
- **Dashboard**: Dynamic calculation of Total Income, Total Expenses, and Net Savings.
- **Transactions**: Add new income or expenses categorized by type.
- **History**: Filterable tabular view of all expenses.
- **Charts**: Visual representation of expense breakdown (Pie Chart) and monthly trends (Bar Chart) using Chart.js.

## Tech Stack
- **Frontend**: React (Vite), Vanilla CSS (Custom Design System), React-Router-Dom, Chart.js.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT & bcrypt.

## Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-link>
   cd finance-app
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Make sure to configure your .env file with MONGO_URI and JWT_SECRET
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   # Create a .env file with: VITE_API_URL=http://localhost:5000 (or your deployed backend URL)
   npm run dev
   ```
