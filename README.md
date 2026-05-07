# Team Task Manager

A full-stack web application for project and task management with role-based access control.

## 🚀 Features

- **Authentication**: Secure signup/login with JWT
- **Project Management**: Create and manage projects
- **Team Management**: Add members to projects with roles (Admin/Member)
- **Task Management**: Create, assign, and track tasks
- **Dashboard**: View tasks, status, and overdue items
- **Role-Based Access**: Admin and Member permissions

## 🛠️ Tech Stack

- **Frontend**: React.js, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Railway

## 📦 Project Structure

```
team-task-manager/
├── backend/           # Node.js + Express API
│   ├── config/        # Database & environment config
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Auth & validation middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── server.js      # Entry point
├── frontend/          # React.js application
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.js
└── database/          # SQL schema
    └── schema.sql
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ABHIshek-lab-bit/Team-Task-Manager
   cd team-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Setup MySQL Database**
   - Create a MySQL database named `team_task_manager`
   - Import the schema:
     ```bash
     mysql -u root -p team_task_manager < database/schema.sql
     ```

4. **Configure Environment Variables**
   
   **Backend (.env):**
   ```bash
   cd backend
   cp .env.example .env
   ```
   Then edit `backend/.env` and update:
   - `DB_PASSWORD` - Your MySQL password
   - `JWT_SECRET` - A strong random secret key
   
   **Frontend (.env):**
   ```bash
   cd frontend
   cp .env.example .env
   ```
   (Frontend .env is already configured for local development)

5. **Run the application**
   ```bash
   npm run dev
   ```
   
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Quick Commands

```bash
# Install all dependencies
npm run install-all

# Run both frontend and backend
npm run dev

# Run backend only
npm run backend

# Run frontend only
npm run frontend
```

## ⚠️ Important Security Notes

- **Never commit `.env` files** to version control
- The `.env.example` files are templates - copy them to `.env` and add your actual credentials
- Generate a strong JWT secret for production (use a random string generator)
- Change default passwords before deploying to production

## 🌐 Deployment

**Deployment Platform:** Railway

### Live Application
- **Frontend**: https://determined-alignment-production.up.railway.app
- **Backend API**: https://team-task-manager-production-ce14.up.railway.app/

### Deployment Notes
- Environment variables are configured via Railway dashboard
- Database is hosted on Railway MySQL
- Automatic deployments enabled from main branch

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Team
- `POST /api/projects/:id/members` - Add member (Admin)
- `DELETE /api/projects/:id/members/:userId` - Remove member (Admin)

## 👥 Developer

**Abhishek Chauhan**
- Full-Stack Developer
- Specialized in React.js, Node.js, and MySQL

## 📄 License

MIT License - feel free to use this project for learning and development.
