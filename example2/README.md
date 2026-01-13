# Task Management Module

A task management module that integrates with the existing team productivity app, allowing users to create, organize, and track personal tasks with priority and due date support.

## Features

- Create, read, update, and delete tasks (CRUD)
- Real-time task status toggling (complete/incomplete)
- Filter tasks by status (all, active, completed)
- Sort tasks by due date or priority
- User data isolation (users can only access their own tasks)
- Responsive UI design for mobile and desktop

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Frontend**: React (components provided)
- **Testing**: Jest

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Installation

1. Clone the repository:
```bash
cd example2
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Generate Prisma client:
```bash
npm run db:generate
```

5. Run database migrations:
```bash
npm run db:migrate
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000/api/v1`

## API Endpoints

All endpoints require authentication via Bearer token.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/tasks | Get all tasks (supports ?status=active/completed&sort=due_date/priority) |
| POST | /api/v1/tasks | Create a new task |
| PUT | /api/v1/tasks/:id | Update a task |
| PATCH | /api/v1/tasks/:id/toggle | Toggle task completion |
| DELETE | /api/v1/tasks/:id | Delete a task |
| GET | /health | Health check (no auth required) |

### Authentication

Include the Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### Example Requests

**Create a Task**
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-user123" \
  -d '{
    "title": "Complete project report",
    "description": "Q1 summary for stakeholders",
    "dueDate": "2024-01-25T17:00:00Z",
    "priority": "high"
  }'
```

**Get All Tasks**
```bash
curl http://localhost:3000/api/v1/tasks \
  -H "Authorization: Bearer test-token-user123"
```

**Filter Active Tasks**
```bash
curl "http://localhost:3000/api/v1/tasks?status=active&sort=priority" \
  -H "Authorization: Bearer test-token-user123"
```

## Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check
```

## Project Structure

```
example2/
├── src/
│   ├── types/           # TypeScript type definitions
│   ├── validation/      # Zod validation schemas
│   ├── repository/      # Data access layer (Prisma)
│   ├── services/        # Business logic layer
│   ├── routes/          # Express route handlers
│   ├── middleware/      # Auth and error middleware
│   ├── utils/           # Logger and DB client
│   ├── frontend/        # React components
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── tests/
│   ├── unit/            # Unit tests
│   ├── integration/     # API integration tests
│   ├── e2e/             # End-to-end tests
│   ├── load/            # Performance tests
│   └── security/        # Security tests
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # SQL migrations
└── docs/                # Documentation
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production) | development |

## Performance Requirements

- Task creation: ≤500ms (NFR-001)
- Task list with 100 items: ≤1s (NFR-002)
- Responsive design for mobile devices (NFR-003)
- User data isolation enforced (NFR-004)

## Security

- All endpoints require authentication
- Users can only access their own tasks (enforced at database query level)
- Input validation on all external data
- Parameterized queries prevent SQL injection
- No sensitive data in logs or error messages
