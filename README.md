# Mini Jira - MERN Stack Project

A simplified Jira-like project management application built with the MERN stack as a trial for The Beelogix.

## Technologies Used

### Backend

- Node.js & Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend

- React with TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with:

   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/mini-jira
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory with:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get a single project
- `PATCH /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `POST /api/projects/:id/members` - Add a member to project

### Tasks

- `GET /api/projects/:projectId/tasks` - Get all tasks for a project
- `POST /api/projects/:projectId/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Project Status

### Completed Features

- ✅ User authentication (register, login, JWT)
- ✅ Project CRUD operations
- ✅ Task CRUD operations
- ✅ Project member management
- ✅ Basic error handling
- ✅ TypeScript integration
- ✅ MongoDB integration
- ✅ API endpoints implementation

## Time Tracking

Total time spent: 5.5 hours

### Breakdown

- Backend setup and configuration: 1 hour
- Database models and schemas: 1 hour
- Authentication implementation: 1 hour
- Project and Task APIs: 1.5 hours
- Error handling and middleware: 30 minutes
- Documentation and README: 30 minutes

## Contributing

Feel free to submit issues and enhancement requests!
