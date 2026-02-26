# Task Management API

## 📚 API Documentation

### Authentication (JWT with HTTP-only Cookies)

#### Register User
```bash
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "123456",
  "fullname": "John Doe"
}

Login User
bash
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
Response sets HTTP-only cookies automatically.

Tasks (Requires Authentication)
Create Task
bash
POST /api/v1/task/create
Cookie: accessToken=your_jwt_token
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish task manager",
  "dueDate": "2026-03-01"
}
Get All Tasks (with Pagination & Filters)
bash
GET /api/v1/task/get-all?page=1&limit=10&status=pending&search=project
Cookie: accessToken=your_jwt_token
Query Parameters:

page: Page number (default: 1)

limit: Items per page (default: 10)

status: Filter by status (pending/completed)

search: Search in title

Update Task
bash
PUT /api/v1/task/update/:taskId
Cookie: accessToken=your_jwt_token
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
Delete Task
bash
DELETE /api/v1/task/delete/:taskId
Cookie: accessToken=your_jwt_token
🔒 Security Features
✅ JWT tokens in HTTP-only cookies

✅ Password hashing with bcrypt

✅ Payload encryption for sensitive fields

✅ Input validation

✅ MongoDB injection prevention

✅ CORS properly configured

✅ Environment variables for secrets

🛠️ Tech Stack
Backend: Node.js, Express

Database: MongoDB with Mongoose

Authentication: JWT with cookies

Security: bcrypt, AES encryption

Container: Docker, Docker Compose

Deployment: Render

🏃 Local Setup
Clone repository

bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
Environment variables

bash
cp .env.example .env
# Edit .env with your values
Run with Docker

bash
docker-compose up
Run without Docker

bash
npm install
npm run dev
🌐 Deployment
Deployed on Render with Docker:

API: https://task-manager-api.onrender.com

Health Check: https://task-manager-api.onrender.com/api/health

📁 Project Structure
text
src/
├── controllers/    # Business logic
├── models/        # Database models
├── middlewares/   # Auth & validation
├── routes/        # API routes
├── utils/         # Helpers & encryption
└── app.js         # Express setup
✅ Features Implemented
User registration & login

JWT with HTTP-only cookies

Password hashing (bcrypt)

Task CRUD operations

User-specific task access

Pagination in task listing

Filter by status

Search by title

Payload encryption

Docker support

Error handling

Input validation