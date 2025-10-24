# User Manager Dashboard

This is a full-stack admin panel for managing users and viewing simple analytics. It features a secure, token-based (JWT) backend API and a responsive React frontend built with Bootstrap and Recharts.

## Tech Stack

### Backend
* **Node.js**
* **Express**
* **PostgreSQL**
* **Sequelize** (ORM)
* **JWT** (JSON Web Tokens) for authentication
* **bcryptjs** for password hashing

### Frontend
* **React**
* **Redux Toolkit** (for state management)
* **React Router** (for navigation)
* **Bootstrap** & **React-Bootstrap** (for UI)
* **Axios** (for API requests)
* **Recharts** (for data visualization)

---

## Core Features

* Secure admin-only login system with JWT.
* Full CRUD (Create, Read, Update, Delete) functionality for users.
* Paginated table of all users.
* Dynamic search and sort (by ID, username, email, etc.).
* Analytics dashboard with charts for:
    * Total Users
    * Active vs. Inactive Users
    * Users by Role

---

## Project Structure

This project is a monorepo containing two separate applications:

* `/user-manager-backend`: The Node.js, Express, and PostgreSQL backend API.
* `/user-manager-frontend`: The React dashboard frontend.

---

## Setup & Installation

You must run both the backend and frontend servers simultaneously in two separate terminals.

### 1. Backend (`user-manager-backend`)

1.  Navigate to the backend folder:
    ```bash
    cd user-manager-backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a PostgreSQL database (e.g., `user_dashboard_db`).
4.  Create a `.env` file in the backend root and add your configuration:
    ```ini
    # Server Port
    PORT=5000
    
    # Database Credentials
    DB_NAME=user_dashboard_db
    DB_USER=your_postgres_username
    DB_PASS=your_postgres_password
    DB_HOST=localhost
    DB_DIALECT=postgres
    
    # JWT Secret Key
    JWT_SECRET=a_strong_and_secret_key
    ```
5.  Run the development server (which syncs the database):
    ```bash
    npm run server
    ```
    The API will be running on `http://localhost:5000`.

### 2. Frontend (`user-manager-frontend`)

1.  Open a **new terminal** and navigate to the frontend folder:
    ```bash
    cd user-manager-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the React development server:
    ```bash
    npm start
    ```
    The application will open on `http://localhost:3000`.

---

## API Endpoints (Quick Reference)

All `/api/users` and `/api/analytics` routes are protected and require an admin JWT (`x-access-token` header).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register-admin` | Creates the first admin account. |
| `POST` | `/api/auth/login` | Logs in an admin and returns a JWT. |
| `GET` | `/api/users` | Gets all users (paginated, searchable, sortable). |
| `POST` | `/api/users` | (Admin) Creates a new user. |
| `GET` | `/api/users/:id` | (Admin) Gets a single user by ID. |
| `PUT` | `/api/users/:id` | (Admin) Updates a user by ID. |
| `DELETE` | `/api/users/:id` | (Admin) Deletes a user by ID. |
| `GET` | `/api/analytics/stats` | (Admin) Gets all analytics data (counts, charts). |
