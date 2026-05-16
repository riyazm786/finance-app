# Finance & Salary Management Web Application - Project Report

## i. Problem Statement

### 1. The Real-World Problem
Many working professionals, freelancers, and students struggle to maintain a clear overview of their personal finances. Tracking monthly income alongside recurring and variable expenses (such as rent, groceries, and subscriptions) is often done manually, leading to poor financial visibility, overspending, and an inability to save effectively.

### 2. Existing Solution Gaps
While there are existing methods to track finances, they come with significant drawbacks:
- **Spreadsheets (Excel/Google Sheets):** Powerful but highly manual, prone to data-entry errors, and often lack user-friendly mobile interfaces or visual dashboards unless heavily customized.
- **Traditional Banking Apps:** Often show raw transactional data without categorized breakdowns. They struggle to incorporate external sources of income or multi-bank data smoothly, failing to give a holistic view of the user's finances.

### 3. Proposed Solution
This project introduces a **Finance & Salary Management Web Application**, an intuitive platform designed to streamline personal finance tracking. Key features include:
- **Secure Authentication:** User registration and login to ensure financial data privacy.
- **Income & Expense Tracking:** Easy-to-use forms for logging salary and granular expenses categorized by type (e.g., food, rent, transport, subscriptions) and date.
- **Interactive Dashboard:** Visual representation of financial health using dynamic charts (pie charts for category breakdown, bar charts for monthly trends) and key metric cards (Total Income, Total Expenses, Net Savings).
- **History & Filtering:** A searchable and filterable list of all financial records to monitor past spending behavior.
- **Reporting:** Functionality to review and export summaries.

### 4. Target Users
- **Working Professionals:** To budget their monthly salary against living expenses and track savings.
- **Freelancers:** To manage variable income streams and separate personal from business expenses.
- **Students:** To manage limited allowances or part-time job income against educational and living costs.

## ii. Frontend Implementation

### 1. UI Architecture & Setup
The frontend was built using **React** (initialized via Vite for optimal performance) and pure CSS for styling. We chose not to use a heavy framework like Tailwind to demonstrate strong fundamentals in CSS Flexbox, Grid, and modern design patterns.

### 2. Design System
We implemented a **"Glassmorphism" Dark Theme**. This includes:
- **CSS Variables:** For consistent theming (vibrant accents like Indigo, Emerald, and Rose against a deep slate background).
- **Glass Cards:** Reusable UI components featuring backdrop filters and subtle borders to create depth.
- **Responsiveness:** Using CSS Grid and Flexbox to ensure mobile compatibility.

### 3. Core Pages Developed
1. **Dashboard (`Dashboard.jsx`):** Features metric cards displaying Total Income, Total Expenses, and Net Savings, calculated dynamically.
2. **Add Record (`AddRecord.jsx`):** A consolidated form with tabs for adding both Expenses (with categories) and Income (with sources). Includes form validation.
3. **History (`History.jsx`):** A tabular view of all logged expenses with dropdown filters by month and category to track spending habits.
4. **Charts View (`ChartsView.jsx`):** Utilizes `react-chartjs-2` to render a Pie Chart showing expense breakdown by category and a Bar Chart illustrating monthly spending trends.
5. **Authentication Views:** Skeleton pages for Login and Registration to be connected to the backend.

### 4. State Management (Temporary)
Prior to building the backend, we implemented a `FinanceContext.jsx` using React Context API to manage global state. Data is temporarily persisted to the browser's `localStorage` to allow for immediate testing of the UI and charts.

## iii. Backend Development

### 1. Architecture
We built a robust REST API using **Node.js** and **Express.js**. The backend follows an MVC-like structure where routes are separated by entity, promoting clean code and maintainability.

### 2. Endpoints Implemented
- **Authentication (`/api/auth`):**
  - `POST /register`: Hashes passwords using `bcrypt` and stores the new user. Returns a JWT.
  - `POST /login`: Verifies credentials and returns a JWT for session management.
- **Expenses (`/api/expenses`):**
  - `GET /`: Retrieves all expenses associated with the logged-in user, protected by JWT middleware.
  - `POST /`: Creates a new expense record.
  - `DELETE /:id`: Removes a specific expense, verifying the user owns the record.
- **Income (`/api/income`):**
  - `GET /` & `POST /`: Similar to expenses, tracks incoming cash flow.
- **Summary (`/api/summary`):**
  - `GET /`: An aggregation endpoint that calculates total income, total expenses, and net savings server-side, reducing frontend processing load.

### 3. Security Measures
- **JWT (JSON Web Tokens):** Used a custom middleware (`authMiddleware.js`) to intercept requests, verify the token, and inject the user context into the request.
- **Password Hashing:** Implemented `bcrypt` to salt and hash passwords before saving them to the database.

## iv. Database Integration

### 1. Database Choice
We utilized **MongoDB** (via the Mongoose ODM) for its flexibility with unstructured JSON-like data, which perfectly matches our React frontend state and Express API payloads.

### 2. Schema Design
We designed three relational collections:
1. **User Schema:** `{ name, email, passwordHash, createdAt }`. `email` is enforced as unique.
2. **Expense Schema:** `{ userId, amount, category, description, date }`. Linked to the User via `mongoose.Schema.Types.ObjectId`.
3. **Income Schema:** `{ userId, amount, source, month, year }`. Similarly linked to the User.

By storing `userId` on every financial record, we ensure horizontal scalability and strict data isolation between different users.

---

*(Section v will be populated as we progress to deployment)*
