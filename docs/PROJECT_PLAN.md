# Mini EdTech Learning Platform - Project Plan

## Project Overview

Building a full-stack EdTech web application with role-based access control, GraphQL API, and modern web technologies.

### Tech Stack

- **Backend**: Node.js, Express.js, Apollo Server (GraphQL), TypeScript, Prisma ORM
- **Database**: PostgreSQL (Local)
- **Frontend**: Next.js, TypeScript, React Context API
- **Authentication**: Mock authentication with session storage
- **Deployment**: Optional CI/CD with GitHub Actions

## Database Design

### PostgreSQL Schema with Prisma

```prisma
// schema.prisma
model User {
  id          String        @id @default(cuid())
  name        String
  email       String        @unique
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  enrollments Enrollment[]

  @@map("users")
}

model Course {
  id           String        @id @default(cuid())
  title        String
  description  String
  level        CourseLevel
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  enrollments  Enrollment[]

  @@map("courses")
}

model Enrollment {
  id       String      @id @default(cuid())
  userId   String      @map("user_id")
  courseId String      @map("course_id")
  role     UserRole
  enrolledAt DateTime  @default(now())

  user     User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  course   Course      @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId])
  @@map("enrollments")
}

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum UserRole {
  STUDENT
  PROFESSOR
}
```

## Backend Architecture (Following Your Pattern)

### Folder Structure

```
server/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── main.ts
│   ├── server.ts
│   ├── common/
│   │   ├── config.ts
│   │   ├── database.ts
│   │   ├── logger.ts
│   │   ├── response.ts
│   │   ├── lib/
│   │   │   ├── catchAsync.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── index.ts
│   │   ├── loaders/
│   │   │   ├── database.ts
│   │   │   └── index.ts
│   │   ├── middlewares/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── index.ts
│   │   └── types/
│   │       ├── express.d.ts
│   │       └── index.ts
│   ├── controllers/
│   │   ├── CourseController.ts
│   │   ├── UserController.ts
│   │   ├── EnrollmentController.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── CourseService.ts
│   │   ├── UserService.ts
│   │   ├── EnrollmentService.ts
│   │   └── index.ts
│   ├── daos/
│   │   ├── BaseDAO.ts
│   │   ├── CourseDAO.ts
│   │   ├── UserDAO.ts
│   │   ├── EnrollmentDAO.ts
│   │   └── index.ts
│   ├── graphql/
│   │   ├── schema.ts
│   │   ├── resolvers/
│   │   │   ├── courseResolvers.ts
│   │   │   ├── userResolvers.ts
│   │   │   ├── enrollmentResolvers.ts
│   │   │   └── index.ts
│   │   └── typedefs/
│   │       ├── course.ts
│   │       ├── user.ts
│   │       ├── enrollment.ts
│   │       └── index.ts
│   ├── routes/
│   │   ├── healthRoutes.ts
│   │   └── index.ts
│   └── scripts/
│       ├── seed-courses.ts
│       └── seed-users.ts
└── logs/
    ├── combined.log
    └── error.log
```

### Core GraphQL Operations

#### Type Definitions

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  enrollments: [Enrollment!]!
  createdAt: String!
  updatedAt: String!
}

type Course {
  id: ID!
  title: String!
  description: String!
  level: CourseLevel!
  enrollments: [Enrollment!]!
  createdAt: String!
  updatedAt: String!
}

type Enrollment {
  id: ID!
  user: User!
  course: Course!
  role: UserRole!
  enrolledAt: String!
}

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum UserRole {
  STUDENT
  PROFESSOR
}

type Query {
  # Fetch all courses
  courses: [Course!]!

  # Fetch single course by ID
  course(id: ID!): Course

  # Get user with enrollments
  user(id: ID!): User

  # Get user's enrollments
  userEnrollments(userId: ID!): [Enrollment!]!
}

type Mutation {
  # Enroll user in course
  enrollInCourse(input: EnrollmentInput!): Enrollment!

  # Update course (Professor only)
  updateCourse(id: ID!, input: UpdateCourseInput!): Course!

  # Mock login
  login(email: String!): AuthPayload!
}

input EnrollmentInput {
  userId: ID!
  courseId: ID!
  role: UserRole!
}

input UpdateCourseInput {
  title: String
  description: String
  level: CourseLevel
}

type AuthPayload {
  user: User!
  token: String!
}
```

## Frontend Architecture

### Folder Structure

```
client/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Home page (course list)
│   │   ├── courses/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx            # Course details
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx        # Edit course (Professor only)
│   │   │   └── page.tsx                # Courses listing
│   │   ├── enrollment/
│   │   │   └── confirmation/
│   │   │       └── page.tsx            # Enrollment confirmation
│   │   ├── login/
│   │   │   └── page.tsx                # Mock login
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                         # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   ├── course/
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseList.tsx
│   │   │   ├── CourseDetails.tsx
│   │   │   └── EditCourseForm.tsx
│   │   ├── enrollment/
│   │   │   ├── EnrollButton.tsx
│   │   │   └── EnrollmentStatus.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── ProtectedRoute.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── CourseContext.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCourses.ts
│   │   └── useEnrollment.ts
│   ├── lib/
│   │   ├── graphql/
│   │   │   ├── client.ts
│   │   │   ├── queries.ts
│   │   │   └── mutations.ts
│   │   ├── utils.ts
│   │   └── types.ts
│   └── types/
│       ├── auth.ts
│       ├── course.ts
│       └── index.ts
```

## Development Phases

### Phase 1: Backend Foundation (Day 1)

1. **Project Setup**

   - Initialize Node.js project with TypeScript
   - Setup Prisma with PostgreSQL
   - Configure Express.js with Apollo Server
   - Setup logging, error handling, and middleware

2. **Database Setup**

   - Create Prisma schema
   - Run migrations
   - Create seed scripts for sample data

3. **Core Backend Architecture**
   - Implement DAOs for database operations
   - Create services for business logic
   - Setup GraphQL schema and resolvers
   - Implement health check endpoints

### Phase 2: GraphQL API Implementation (Day 1-2)

1. **Query Resolvers**

   - Implement `courses` query
   - Implement `course(id)` query
   - Implement `user` query with enrollments

2. **Mutation Resolvers**

   - Implement `enrollInCourse` mutation
   - Implement mock `login` mutation
   - Implement `updateCourse` mutation (for professors)

3. **Testing & Validation**
   - Test all GraphQL operations
   - Implement error handling
   - Add input validation

### Phase 3: Frontend Foundation (Day 2)

1. **Next.js Setup**

   - Initialize Next.js project with TypeScript
   - Setup Tailwind CSS for styling
   - Configure Apollo Client for GraphQL

2. **Context & State Management**

   - Create AuthContext for user state
   - Create CourseContext for course data
   - Implement local storage persistence

3. **Base Components**
   - Create reusable UI components
   - Implement layout components
   - Setup routing structure

### Phase 4: Core Frontend Features (Day 2-3)

1. **Authentication Flow**

   - Mock login form
   - User session management
   - Protected routes implementation

2. **Course Management**

   - Home page with course listing
   - Course details page
   - Enrollment functionality

3. **Role-Based Features**
   - Student view restrictions
   - Professor edit capabilities
   - Role-based navigation

### Phase 5: Advanced Features & Polish (Day 3)

1. **Enhanced UX**

   - Loading states
   - Error boundaries
   - Form validation
   - Responsive design

2. **Professor Features**

   - Edit course form
   - Role verification
   - Update course mutations

3. **Testing & Bug Fixes**
   - End-to-end testing
   - Bug fixes and optimizations
   - Performance improvements

### Phase 6: Documentation & Deployment (Day 3)

1. **Documentation**

   - README with setup instructions
   - API documentation
   - Code comments

2. **Optional Deployment**
   - GitHub Actions setup
   - Environment configuration
   - Deployment scripts

## Key Implementation Details

### Authentication Strategy

- Mock authentication with email-based login
- Store user data in localStorage/sessionStorage
- JWT-like token simulation for GraphQL context
- Role-based access control in resolvers

### Error Handling

- Global error boundary in React
- GraphQL error formatting
- User-friendly error messages
- Logging for debugging

### State Management with Context API

```typescript
// AuthContext structure
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  hasRole: (courseId: string, role: UserRole) => boolean;
}

// CourseContext structure
interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  fetchCourse: (id: string) => Promise<void>;
  enrollInCourse: (courseId: string, role: UserRole) => Promise<void>;
  updateCourse: (id: string, updates: UpdateCourseInput) => Promise<void>;
}
```

### Security Considerations

- Input validation and sanitization
- Role-based authorization
- CORS configuration
- Rate limiting (basic implementation)

## Success Metrics

- All core requirements implemented
- Clean, modular code structure
- Comprehensive error handling
- User-friendly interface
- Role-based access working correctly
- Documentation complete

## Risk Mitigation

- Start with MVP features first
- Regular testing throughout development
- Fallback to simpler implementations if needed
- Time management with daily checkpoints

This plan provides a comprehensive roadmap for building the Mini EdTech Learning Platform while following your established backend architecture patterns. Each phase builds upon the previous one, ensuring a systematic and manageable development process.
