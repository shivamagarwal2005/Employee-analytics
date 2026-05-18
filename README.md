# AI-Based Employee Performance Analytics & Recommendation System

A full-stack MERN application that analyzes employee performance data and provides AI-powered recommendations using the OpenRouter API (OpenAI-compatible).

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6, Axios  |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB with Mongoose             |
| Auth       | JWT + bcryptjs                    |
| AI         | OpenRouter (OpenAI-compatible API)|
| Deployment | Render (backend + frontend)       |

---

## Project Structure

```
employee-analytics/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Login, signup, getMe
│   │   ├── employeeController.js  # CRUD operations
│   │   └── aiController.js       # AI recommendation logic
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect middleware
│   │   └── errorHandler.js       # Global error handler
│   ├── models/
│   │   ├── User.js               # User schema (bcrypt hashed password)
│   │   └── Employee.js           # Employee schema with validation
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── aiRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── AIRecommendationDisplay.js
    │   │   ├── EmployeeCard.js
    │   │   ├── EmployeeForm.js
    │   │   ├── Navbar.js
    │   │   ├── PrivateRoute.js
    │   │   └── SearchFilter.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── AddEmployeePage.js
    │   │   ├── AIRecommendationsPage.js
    │   │   ├── DashboardPage.js
    │   │   ├── EditEmployeePage.js
    │   │   ├── EmployeeListPage.js
    │   │   ├── LoginPage.js
    │   │   └── SignupPage.js
    │   ├── services/
    │   │   ├── api.js             # Axios instance with JWT interceptor
    │   │   ├── aiService.js
    │   │   ├── authService.js
    │   │   └── employeeService.js
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- OpenRouter API key → https://openrouter.ai

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/employee-analytics.git
cd employee-analytics
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee_analytics
JWT_SECRET=your_super_secret_jwt_key
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=openai/gpt-3.5-turbo
```

Start backend:

```bash
npm run dev      # Development (nodemon)
npm start        # Production
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env`:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm start
```

The app will open at **http://localhost:3000**

---

## API Endpoints

### Auth Endpoints

| Method | URL               | Access  | Description     |
|--------|-------------------|---------|-----------------|
| POST   | /api/auth/signup  | Public  | Register user   |
| POST   | /api/auth/login   | Public  | Login user      |
| GET    | /api/auth/me      | Private | Get current user|

### Employee Endpoints

| Method | URL                               | Access  | Description           |
|--------|-----------------------------------|---------|-----------------------|
| POST   | /api/employees                    | Private | Add employee          |
| GET    | /api/employees                    | Private | Get all employees     |
| GET    | /api/employees/:id                | Private | Get employee by ID    |
| GET    | /api/employees/search?department= | Private | Search/filter employees|
| PUT    | /api/employees/:id                | Private | Update employee       |
| DELETE | /api/employees/:id                | Private | Delete employee       |

### AI Endpoints

| Method | URL               | Access  | Description                    |
|--------|-------------------|---------|--------------------------------|
| POST   | /api/ai/recommend | Private | Get AI recommendation/ranking  |

**POST /api/ai/recommend body options:**
```json
// Single employee
{ "employeeId": "mongo_object_id" }

// All employees ranked
{}

// Multiple specific employees
{ "employeeIds": ["id1", "id2"] }
```

---

## Sample Request Bodies

### Add Employee
```json
POST /api/employees
{
  "name": "Aman Verma",
  "email": "aman@gmail.com",
  "department": "Development",
  "skills": ["React", "Node.js", "MongoDB"],
  "performanceScore": 85,
  "experience": 3
}
```

### Login
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

---

## MongoDB Test Cases

| Test Case              | Expected Output             |
|------------------------|-----------------------------|
| Insert valid employee  | Employee stored successfully |
| Duplicate email        | 409 error message            |
| Missing performanceScore | Validation error           |
| Search by department   | Filtered employee list       |

---

## Authentication Test Cases

| Test Case                      | Expected Output      |
|-------------------------------|----------------------|
| Valid login                    | JWT Token generated  |
| Invalid password               | 401 Unauthorized     |
| Access protected route without token | 401 Access denied |
| Password stored in DB          | bcrypt encrypted     |

---

## Deployment on Render

### Backend

1. Create a **Web Service** on Render
2. Connect your GitHub repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `.env`

### Frontend

1. Create a **Static Site** on Render
2. Connect your GitHub repo
3. Root directory: `frontend`
4. Build command: `npm install && npm run build`
5. Publish directory: `build`
6. Add env variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

---

## Features

- ✅ JWT Authentication with bcrypt password hashing
- ✅ Employee CRUD operations
- ✅ Search & filter by department, name, score range
- ✅ AI-powered individual recommendations (promotion, training, feedback)
- ✅ AI-powered team ranking and skill gap analysis
- ✅ Protected routes (frontend + backend)
- ✅ Global error handling middleware
- ✅ Input validation (express-validator + frontend)
- ✅ Responsive UI

---

## Git Commit Guidelines

```
feat: add employee CRUD
feat: implement JWT auth
feat: integrate OpenRouter AI API
fix: handle duplicate email error
style: responsive navbar
docs: update README
```
