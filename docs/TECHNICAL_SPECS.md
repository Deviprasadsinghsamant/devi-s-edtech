# Technical Specifications - Mini EdTech Learning Platform

## System Architecture Overview

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Express.js    │    │   PostgreSQL    │
│   Frontend      │────│   GraphQL API   │────│   Database      │
│   (Port 3000)   │    │   (Port 4000)   │    │   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack Details

#### Backend Technologies

- **Runtime**: Node.js 18+ with TypeScript 4.9+
- **Framework**: Express.js 4.18+ with Apollo Server 3.12+
- **Database**: PostgreSQL 14+ with Prisma ORM 4.15+
- **Authentication**: Mock JWT-style with session storage
- **Validation**: GraphQL built-in + custom validators
- **Logging**: Winston 3.8+ with file and console transports

#### Frontend Technologies

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript 4.9+
- **Styling**: Tailwind CSS 3.3+
- **State Management**: React Context API
- **HTTP Client**: Apollo Client 3.7+
- **UI Components**: Custom components with Tailwind

## Database Design Specifications

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    User     │         │ Enrollment  │         │   Course    │
│             │         │             │         │             │
│ id (PK)     │◄────────│ id (PK)     │────────►│ id (PK)     │
│ name        │         │ user_id(FK) │         │ title       │
│ email (UQ)  │         │ course_id(FK)│         │ description │
│ created_at  │         │ role        │         │ level       │
│ updated_at  │         │ enrolled_at │         │ created_at  │
└─────────────┘         └─────────────┘         │ updated_at  │
                                                └─────────────┘
```

### Prisma Schema Specifications

```prisma
// Database connection
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Prisma client generation
generator client {
  provider = "prisma-client-js"
}

// User model
model User {
  id          String        @id @default(cuid())
  name        String        @db.VarChar(255)
  email       String        @unique @db.VarChar(255)
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")
  enrollments Enrollment[]

  @@map("users")
}

// Course model
model Course {
  id           String        @id @default(cuid())
  title        String        @db.VarChar(255)
  description  String        @db.Text
  level        CourseLevel
  createdAt    DateTime      @default(now()) @map("created_at")
  updatedAt    DateTime      @updatedAt @map("updated_at")
  enrollments  Enrollment[]

  @@map("courses")
}

// Enrollment junction table
model Enrollment {
  id         String      @id @default(cuid())
  userId     String      @map("user_id")
  courseId   String      @map("course_id")
  role       UserRole
  enrolledAt DateTime    @default(now()) @map("enrolled_at")

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  course     Course      @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId])
  @@map("enrollments")
}

// Enums
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

### Database Constraints and Indexes

```sql
-- Indexes for performance
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_enrollments_role ON enrollments(role);

-- Constraints
ALTER TABLE enrollments ADD CONSTRAINT unique_user_course UNIQUE (user_id, course_id);
ALTER TABLE users ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

## GraphQL API Specifications

### Complete Schema Definition

```graphql
# Scalar types
scalar DateTime

# User type
type User {
  id: ID!
  name: String!
  email: String!
  enrollments: [Enrollment!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Course type
type Course {
  id: ID!
  title: String!
  description: String!
  level: CourseLevel!
  enrollments: [Enrollment!]!
  enrollmentCount: Int!
  professorCount: Int!
  studentCount: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Enrollment type
type Enrollment {
  id: ID!
  user: User!
  course: Course!
  role: UserRole!
  enrolledAt: DateTime!
}

# Enums
enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum UserRole {
  STUDENT
  PROFESSOR
}

# Input types
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

input CourseFilter {
  level: CourseLevel
  hasEnrollments: Boolean
}

# Authentication payload
type AuthPayload {
  user: User!
  token: String!
  expiresAt: DateTime!
}

# Query root type
type Query {
  # Course queries
  courses(filter: CourseFilter): [Course!]!
  course(id: ID!): Course

  # User queries
  user(id: ID!): User
  userByEmail(email: String!): User

  # Enrollment queries
  userEnrollments(userId: ID!): [Enrollment!]!
  courseEnrollments(courseId: ID!): [Enrollment!]!

  # Utility queries
  courseCount: Int!
  userCount: Int!
}

# Mutation root type
type Mutation {
  # Authentication
  login(email: String!): AuthPayload!

  # Enrollment operations
  enrollInCourse(input: EnrollmentInput!): Enrollment!
  unenrollFromCourse(userId: ID!, courseId: ID!): Boolean!

  # Course operations (Professor only)
  updateCourse(id: ID!, input: UpdateCourseInput!): Course!

  # User operations
  createUser(name: String!, email: String!): User!
}

# Subscription type (for future enhancements)
type Subscription {
  courseUpdated(courseId: ID!): Course!
  newEnrollment(courseId: ID!): Enrollment!
}
```

### GraphQL Resolver Specifications

#### Query Resolvers

```typescript
export const queryResolvers = {
  courses: async (
    _: any,
    args: { filter?: CourseFilter },
    context: Context
  ) => {
    return context.courseService.getAllCourses(args.filter);
  },

  course: async (_: any, { id }: { id: string }, context: Context) => {
    return context.courseService.getCourseById(id);
  },

  user: async (_: any, { id }: { id: string }, context: Context) => {
    return context.userService.getUserById(id);
  },

  userEnrollments: async (
    _: any,
    { userId }: { userId: string },
    context: Context
  ) => {
    return context.enrollmentService.getUserEnrollments(userId);
  },
};
```

#### Mutation Resolvers

```typescript
export const mutationResolvers = {
  login: async (_: any, { email }: { email: string }, context: Context) => {
    return context.authService.mockLogin(email);
  },

  enrollInCourse: async (
    _: any,
    { input }: { input: EnrollmentInput },
    context: Context
  ) => {
    return context.enrollmentService.enrollUser(input);
  },

  updateCourse: async (
    _: any,
    { id, input }: { id: string; input: UpdateCourseInput },
    context: Context
  ) => {
    // Validate professor access
    await context.authService.validateProfessorAccess(id, context.user?.id);
    return context.courseService.updateCourse(id, input);
  },
};
```

## Backend Architecture Specifications

### Service Layer Patterns

#### Base Service Class

```typescript
export abstract class BaseService {
  protected logger: Logger;

  constructor() {
    this.logger = getLogger(this.constructor.name);
  }

  protected async handleServiceError(
    error: Error,
    operation: string
  ): Promise<never> {
    this.logger.error(`Error in ${operation}:`, error);
    throw new GraphQLError(`${operation} failed: ${error.message}`, {
      extensions: { code: "INTERNAL_ERROR" },
    });
  }
}
```

#### Course Service Implementation

```typescript
export class CourseService extends BaseService {
  private courseDAO: CourseDAO;
  private enrollmentDAO: EnrollmentDAO;

  constructor() {
    super();
    this.courseDAO = new CourseDAO();
    this.enrollmentDAO = new EnrollmentDAO();
  }

  async getAllCourses(filter?: CourseFilter): Promise<Course[]> {
    try {
      return await this.courseDAO.findAll(filter);
    } catch (error) {
      return this.handleServiceError(error as Error, "Get all courses");
    }
  }

  async updateCourse(id: string, input: UpdateCourseInput): Promise<Course> {
    try {
      const existingCourse = await this.courseDAO.findById(id);
      if (!existingCourse) {
        throw new Error("Course not found");
      }

      return await this.courseDAO.update(id, input);
    } catch (error) {
      return this.handleServiceError(error as Error, "Update course");
    }
  }
}
```

### DAO Layer Patterns

#### Base DAO Implementation

```typescript
export abstract class BaseDAO<T> {
  protected prisma: PrismaClient;
  protected logger: Logger;

  constructor() {
    this.prisma = new PrismaClient();
    this.logger = getLogger(this.constructor.name);
  }

  abstract findAll(filter?: any): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract create(data: any): Promise<T>;
  abstract update(id: string, data: any): Promise<T>;
  abstract delete(id: string): Promise<void>;

  protected async handleDAOError(
    error: Error,
    operation: string
  ): Promise<never> {
    this.logger.error(`DAO Error in ${operation}:`, error);
    throw error;
  }
}
```

#### Course DAO Implementation

```typescript
export class CourseDAO extends BaseDAO<Course> {
  async findAll(filter?: CourseFilter): Promise<Course[]> {
    try {
      const where: any = {};

      if (filter?.level) {
        where.level = filter.level;
      }

      if (filter?.hasEnrollments !== undefined) {
        where.enrollments = filter.hasEnrollments ? { some: {} } : { none: {} };
      }

      return await this.prisma.course.findMany({
        where,
        include: {
          enrollments: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Find all courses");
    }
  }

  async update(id: string, data: UpdateCourseInput): Promise<Course> {
    try {
      return await this.prisma.course.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      return this.handleDAOError(error as Error, "Update course");
    }
  }
}
```

## Frontend Architecture Specifications

### Context API Implementation

#### Auth Context

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  hasRole: (courseId: string, role: UserRole) => boolean;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email },
      });

      const userData = data.login.user;
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      localStorage.setItem("auth_token", data.login.token);
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const hasRole = (courseId: string, role: UserRole): boolean => {
    if (!user) return false;

    return user.enrollments.some(
      (enrollment) =>
        enrollment.course.id === courseId && enrollment.role === role
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

#### Course Context

```typescript
interface CourseContextType {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  fetchCourse: (id: string) => Promise<void>;
  enrollInCourse: (courseId: string, role: UserRole) => Promise<void>;
  updateCourse: (id: string, updates: UpdateCourseInput) => Promise<void>;
}

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apolloClient.query({
        query: GET_COURSES_QUERY,
        fetchPolicy: "cache-and-network",
      });

      setCourses(data.courses);
    } catch (err) {
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        currentCourse,
        loading,
        error,
        fetchCourses,
        fetchCourse,
        enrollInCourse,
        updateCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
```

### Component Specifications

#### Course Card Component

```typescript
interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
  onEnroll?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  showEnrollButton = true,
  onEnroll,
}) => {
  const { user, hasRole } = useAuth();
  const isEnrolled =
    user && course.enrollments.some((e) => e.user.id === user.id);
  const isProfessor = user && hasRole(course.id, UserRole.PROFESSOR);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
        <span
          className={`px-2 py-1 text-xs rounded-full ${getLevelColor(
            course.level
          )}`}
        >
          {course.level}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {course.enrollmentCount} enrolled
        </div>

        <div className="space-x-2">
          {isProfessor && (
            <Link href={`/courses/${course.id}/edit`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
          )}

          {showEnrollButton && !isEnrolled && (
            <Button onClick={() => onEnroll?.(course.id)} size="sm">
              Enroll
            </Button>
          )}

          <Link href={`/courses/${course.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
```

## Security Specifications

### Authentication Security

- Mock JWT tokens with expiration
- Session storage for client-side state
- Role-based access control
- Protected route guards

### API Security

- Input validation on all mutations
- Rate limiting (basic implementation)
- CORS configuration
- Helmet.js security headers

### Database Security

- Parameterized queries via Prisma
- Input sanitization
- Foreign key constraints
- Unique constraints where needed

## Performance Specifications

### Backend Performance

- Connection pooling with Prisma
- Efficient database queries with proper indexes
- GraphQL query depth limiting
- Response caching headers

### Frontend Performance

- Apollo Client caching
- Optimistic updates for mutations
- Lazy loading for routes
- Image optimization with Next.js

## Error Handling Specifications

### Backend Error Handling

```typescript
export class ErrorHandler {
  static handle(error: Error): GraphQLError {
    if (error instanceof PrismaClientKnownRequestError) {
      return new GraphQLError("Database error", {
        extensions: { code: "DATABASE_ERROR" },
      });
    }

    if (error instanceof ValidationError) {
      return new GraphQLError("Validation failed", {
        extensions: { code: "VALIDATION_ERROR", details: error.details },
      });
    }

    return new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_ERROR" },
    });
  }
}
```

### Frontend Error Handling

```typescript
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600">{this.state.error}</p>
          <Button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

This technical specification provides comprehensive implementation details for building the Mini EdTech Learning Platform following your established architecture patterns.
