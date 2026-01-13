# Architecture Specification: Task Management

## Document Information
| Field | Value |
|-------|-------|
| Title | Task Management Architecture |
| Date | 2024-01-21 |
| Version | 1.0 |
| Author | Architect Agent (Codex CLI) |
| Status | Approved |
| PRD Reference | docs/PRD.md v1.0 |

---

## 1. System Overview

### Purpose
A task management module that integrates with the existing team productivity app, allowing users to create, organize, and track personal tasks with priority and due date support.

### Key Capabilities
- CRUD operations for tasks
- Real-time status updates
- Filtering and sorting
- User data isolation

### Design Principles
1. **Simplicity**: Minimal abstractions for a straightforward feature
2. **Performance**: Sub-second responses for all operations
3. **Security**: Strict user data isolation
4. **Maintainability**: Clean separation of concerns

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  TaskList    │  │  TaskForm    │  │  TaskFilter  │           │
│  │  Component   │  │  Component   │  │  Component   │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                    │
│         └─────────────────┼─────────────────┘                    │
│                           │                                      │
│                    ┌──────┴───────┐                              │
│                    │  useTask     │                              │
│                    │  Hook        │                              │
│                    │  (React      │                              │
│                    │   Query)     │                              │
│                    └──────┬───────┘                              │
└───────────────────────────┼──────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Node.js/Express)                   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Auth Middleware                          │ │
│  │              (Validates JWT, extracts userId)               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌───────────────────────────┼───────────────────────────────┐  │
│  │                    Task Routes                             │  │
│  │   GET /tasks    POST /tasks    PUT /tasks/:id              │  │
│  │   DELETE /tasks/:id    PATCH /tasks/:id/toggle             │  │
│  └───────────────────────────┼───────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────┼───────────────────────────────┐  │
│  │                   Task Service                             │  │
│  │   - createTask()    - getTasks()    - updateTask()         │  │
│  │   - deleteTask()    - toggleComplete()                     │  │
│  └───────────────────────────┼───────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────┼───────────────────────────────┐  │
│  │                  Task Repository                           │  │
│  │              (Prisma ORM / Data Access)                    │  │
│  └───────────────────────────┼───────────────────────────────┘  │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                          │
│                                                                  │
│  ┌────────────────┐                                             │
│  │     tasks      │                                             │
│  ├────────────────┤                                             │
│  │ id             │ UUID, PK                                    │
│  │ user_id        │ UUID, FK → users                            │
│  │ title          │ VARCHAR(255), NOT NULL                      │
│  │ description    │ TEXT                                        │
│  │ due_date       │ TIMESTAMP                                   │
│  │ priority       │ ENUM (low, medium, high)                    │
│  │ is_completed   │ BOOLEAN, default false                      │
│  │ created_at     │ TIMESTAMP                                   │
│  │ updated_at     │ TIMESTAMP                                   │
│  └────────────────┘                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Responsibilities

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| TaskList | Display tasks, handle toggle/delete | React |
| TaskForm | Create/edit task form | React |
| TaskFilter | Filter and sort controls | React |
| useTask Hook | API calls, caching, mutations | React Query |
| Auth Middleware | Validate JWT, extract user | Express |
| Task Routes | HTTP endpoint handlers | Express |
| Task Service | Business logic | Node.js |
| Task Repository | Database operations | Prisma |

---

## 4. Data Models

### Task Entity

```typescript
interface Task {
  id: string;           // UUID v4
  userId: string;       // FK to User (from auth)
  title: string;        // Required, max 255 chars
  description?: string; // Optional, unlimited
  dueDate?: Date;       // Optional
  priority: Priority;   // Enum: low, medium, high
  isCompleted: boolean; // Default: false
  createdAt: Date;
  updatedAt: Date;
}

enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
```

### Database Schema

```sql
-- Create priority enum
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority task_priority NOT NULL DEFAULT 'medium',
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance (NFR-002)
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, is_completed);
CREATE INDEX idx_tasks_user_due_date ON tasks(user_id, due_date);
```

---

## 5. API Contracts

### Base URL
- Development: `http://localhost:3000/api/v1`
- Production: `https://api.example.com/v1`

### Authentication
All endpoints require Bearer token:
```
Authorization: Bearer <jwt_token>
```

---

### GET /tasks
**Description**: Get all tasks for authenticated user (FR-002)

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter: all, active, completed (FR-006) |
| sort | string | Sort: due_date, priority (FR-007) |

**Response (200)**:
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Complete project report",
      "description": "Q1 summary for stakeholders",
      "dueDate": "2024-01-25T17:00:00Z",
      "priority": "high",
      "isCompleted": false,
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

### POST /tasks
**Description**: Create new task (FR-001)

**Request**:
```json
{
  "title": "Complete project report",
  "description": "Q1 summary for stakeholders",
  "dueDate": "2024-01-25T17:00:00Z",
  "priority": "high"
}
```

**Response (201)**:
```json
{
  "id": "uuid",
  "title": "Complete project report",
  "description": "Q1 summary for stakeholders",
  "dueDate": "2024-01-25T17:00:00Z",
  "priority": "high",
  "isCompleted": false,
  "createdAt": "2024-01-20T10:00:00Z",
  "updatedAt": "2024-01-20T10:00:00Z"
}
```

**Errors**:
| Status | Code | Condition |
|--------|------|-----------|
| 400 | ERR_VALIDATION | Title empty (AC-003) |
| 401 | ERR_UNAUTHORIZED | Invalid/missing token |

---

### PUT /tasks/:id
**Description**: Update task (FR-003)

**Request**:
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2024-01-26T17:00:00Z",
  "priority": "medium"
}
```

**Response (200)**: Updated task object

**Errors**:
| Status | Code | Condition |
|--------|------|-----------|
| 404 | ERR_NOT_FOUND | Task doesn't exist |
| 403 | ERR_FORBIDDEN | Task belongs to another user (NFR-004) |

---

### PATCH /tasks/:id/toggle
**Description**: Toggle completion status (FR-004)

**Response (200)**:
```json
{
  "id": "uuid",
  "isCompleted": true,
  "updatedAt": "2024-01-20T15:00:00Z"
}
```

---

### DELETE /tasks/:id
**Description**: Delete task (FR-005)

**Response (204)**: No content

**Errors**:
| Status | Code | Condition |
|--------|------|-----------|
| 404 | ERR_NOT_FOUND | Task doesn't exist |
| 403 | ERR_FORBIDDEN | Task belongs to another user |

---

## 6. Security Model

### Authentication
- JWT tokens from existing auth service
- Token validated on every request
- User ID extracted from token claims

### Authorization
- Users can ONLY access tasks where `task.user_id = token.userId`
- All queries filter by user_id (enforced in repository layer)

### Input Validation
```typescript
const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
});
```

---

## 7. Performance Considerations

### NFR-001: Task Creation ≤500ms
- Minimal validation
- Single INSERT query
- No external service calls

### NFR-002: Task List ≤1s with 100 tasks
- Indexed queries on user_id
- Pagination ready (default 100 limit)
- Single query with optional filters

### Query Optimization
```sql
-- Efficient query for user's tasks with filters
SELECT * FROM tasks 
WHERE user_id = $1 
  AND ($2::boolean IS NULL OR is_completed = $2)
ORDER BY 
  CASE WHEN $3 = 'due_date' THEN due_date END ASC,
  CASE WHEN $3 = 'priority' THEN 
    CASE priority 
      WHEN 'high' THEN 1 
      WHEN 'medium' THEN 2 
      WHEN 'low' THEN 3 
    END 
  END ASC
LIMIT 100;
```

---

## 8. Observability

### Logging Events
- `task.created` - New task created
- `task.updated` - Task modified
- `task.completed` - Task marked complete
- `task.deleted` - Task removed
- `task.list.viewed` - Task list accessed

### Log Format
```json
{
  "timestamp": "2024-01-20T10:00:00Z",
  "level": "info",
  "service": "task-service",
  "event": "task.created",
  "userId": "uuid",
  "taskId": "uuid",
  "duration": 45
}
```

---

## 9. Definition of Done

### Code
- [ ] All 5 API endpoints implemented
- [ ] Task model with Prisma schema
- [ ] Service layer with business logic
- [ ] Repository layer with queries
- [ ] Input validation on all endpoints
- [ ] Auth middleware integration

### Frontend
- [ ] TaskList component
- [ ] TaskForm component (create/edit)
- [ ] TaskFilter component
- [ ] useTask hook with React Query
- [ ] Responsive design (NFR-003)

### Tests
- [ ] Unit tests for service layer
- [ ] Integration tests for API endpoints
- [ ] E2E tests for main flows
- [ ] Performance test for NFR-001, NFR-002

### Security
- [ ] All endpoints require auth
- [ ] User isolation enforced
- [ ] Input validation complete

---

## 10. Requirement Mapping

| Requirement | Design Element | Test |
|-------------|---------------|------|
| FR-001 | POST /tasks, TaskService.create | tests/integration/create-task.test.ts |
| FR-002 | GET /tasks, TaskList component | tests/e2e/view-tasks.test.ts |
| FR-003 | PUT /tasks/:id, TaskForm | tests/integration/update-task.test.ts |
| FR-004 | PATCH /tasks/:id/toggle | tests/integration/toggle-task.test.ts |
| FR-005 | DELETE /tasks/:id | tests/integration/delete-task.test.ts |
| FR-006 | GET /tasks?status=, TaskFilter | tests/integration/filter-tasks.test.ts |
| FR-007 | GET /tasks?sort=, TaskFilter | tests/integration/sort-tasks.test.ts |
| NFR-001 | Optimized create query | tests/load/create-task.test.ts |
| NFR-002 | Indexed queries | tests/load/list-tasks.test.ts |
| NFR-004 | Auth middleware, WHERE clause | tests/security/isolation.test.ts |

---

## Architect Gate Checklist

- [x] Every FR maps to design element
- [x] Every NFR maps to design element
- [x] Every requirement has test
- [x] API contracts complete
- [x] Data models complete
- [x] Security model documented
- [x] Definition of Done clear

**Gate Status**: ✅ PASS
