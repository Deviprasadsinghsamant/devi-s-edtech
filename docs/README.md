# Mini EdTech Learning Platform

A modern, full-stack EdTech application built with GraphQL, Next.js, and PostgreSQL, featuring role-based access control and course management capabilities.

## 🚀 Project Overview

This project implements a simple yet powerful EdTech platform where users can browse courses, enroll as students or professors, and manage course content based on their roles. The application follows a modular, layered architecture with clear separation of concerns.

### Key Features

- **Course Management**: Browse and view detailed course information
- **Role-Based Enrollment**: Users can enroll as students or professors
- **Professor Capabilities**: Edit course content (title, description, level)
- **Student Experience**: View course content without edit permissions
- **Mock Authentication**: Simple email-based login system
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🏗️ Architecture

### Tech Stack

**Backend:**

- Node.js 18+ with TypeScript
- Express.js with Apollo Server (GraphQL)
- PostgreSQL with Prisma ORM
- Winston for logging
- JWT-style mock authentication

**Frontend:**

- Next.js 13+ with App Router
- TypeScript
- React Context API for state management
- Apollo Client for GraphQL
- Tailwind CSS for styling

**Database:**

- PostgreSQL 14+
- Prisma migrations
- Seed data for development

### System Architecture

```
┌─────────────────┐    GraphQL     ┌─────────────────┐    Prisma      ┌─────────────────┐
│   Next.js       │◄──────────────►│   Express.js    │◄──────────────►│   PostgreSQL    │
│   Frontend      │    Port 3000   │   Apollo Server │   Port 4000    │   Database      │
│   (Client)      │                │   (API)         │                │   (Data)        │
└─────────────────┘                └─────────────────┘                └─────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (version 14 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nexusHorizon-assessment
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Update .env with your PostgreSQL credentials
DB_USER=postgres
DB_PASSWORD=Postgresql12
DB_NAME=nextcaredb
DB_PORT=5432
DATABASE_URL="postgresql://postgres:Postgresql12@localhost:5432/nextcaredb"
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=4000

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed

# Start the development server
npm run dev
```

The GraphQL API will be available at `http://localhost:4000/graphql`

### 3. Frontend Setup

```bash
# Navigate to client directory (in a new terminal)
cd client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Update .env.local with API URL
NEXT_PUBLIC_GRAPHQL_URI=http://localhost:4000/graphql

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📊 Database Schema

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

### Sample Data

The seed script creates:

- 5 sample users
- 8 courses across different levels (Beginner, Intermediate, Advanced)
- Various enrollments with student and professor roles

## 🔧 Development

### Backend Development

```bash
cd server

# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev      # Create and apply migration
npx prisma db seed         # Seed database
npx prisma generate        # Generate Prisma client

# Linting and formatting
npm run lint
npm run format
```

### Frontend Development

```bash
cd client

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting and formatting
npm run lint
npm run format
```

## 📱 Usage Guide

### 1. Authentication

1. Navigate to `/login`
2. Enter any email address (mock authentication)
3. You'll be logged in and redirected to the home page

### 2. Browsing Courses

- Visit the home page to see all available courses
- Click on any course card to view detailed information
- Courses display their level (Beginner, Intermediate, Advanced)

### 3. Enrolling in Courses

1. On a course details page, click "Enroll as Student" or "Enroll as Professor"
2. You'll be redirected to a confirmation page
3. Your enrollment will be saved and you can access the course with your assigned role

### 4. Role-Based Features

**Students:**

- Can view course content
- Cannot edit course information
- See "Enrolled as Student" status

**Professors:**

- Can view course content
- Can edit course title, description, and level
- See "Edit Course" button on course pages
- Access to `/courses/[id]/edit` page

## 🧪 Testing

### Backend Testing

```bash
cd server

# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Test GraphQL endpoints manually
# Visit http://localhost:4000/graphql for GraphQL Playground
```

### Frontend Testing

```bash
cd client

# Run component tests
npm test

# Run e2e tests
npm run test:e2e

# Visual regression tests
npm run test:visual
```

### Sample GraphQL Queries

```graphql
# Get all courses
query GetCourses {
  courses {
    id
    title
    description
    level
    enrollmentCount
  }
}

# Get course by ID
query GetCourse($id: ID!) {
  course(id: $id) {
    id
    title
    description
    level
    enrollments {
      id
      role
      user {
        name
        email
      }
    }
  }
}

# Enroll in course
mutation EnrollInCourse($input: EnrollmentInput!) {
  enrollInCourse(input: $input) {
    id
    role
    user {
      name
    }
    course {
      title
    }
  }
}

# Update course (professors only)
mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
  updateCourse(id: $id, input: $input) {
    id
    title
    description
    level
  }
}
```

## 🚀 Deployment

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t edtech-api ./server
docker build -t edtech-client ./client
```

### Manual Deployment

**Backend (Railway/Render/Heroku):**

1. Set environment variables
2. Run `npm run build`
3. Start with `npm start`

**Frontend (Vercel/Netlify):**

1. Set `NEXT_PUBLIC_GRAPHQL_URI` environment variable
2. Run `npm run build`
3. Deploy the `.next` folder

### Environment Variables

**Backend (.env):**

```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-jwt-secret
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://yourdomain.com
```

**Frontend (.env.local):**

```env
NEXT_PUBLIC_GRAPHQL_URI=https://your-api-domain.com/graphql
```

## 📁 Project Structure

```
nexusHorizon-assessment/
├── server/                          # Backend application
│   ├── prisma/                      # Database schema and migrations
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── main.ts                  # Application entry point
│   │   ├── server.ts                # Express server setup
│   │   ├── common/                  # Shared utilities
│   │   │   ├── config.ts
│   │   │   ├── database.ts
│   │   │   ├── logger.ts
│   │   │   └── lib/
│   │   ├── controllers/             # Request handlers
│   │   ├── services/                # Business logic
│   │   ├── daos/                    # Data access objects
│   │   ├── graphql/                 # GraphQL schema and resolvers
│   │   │   ├── schema.ts
│   │   │   ├── typedefs/
│   │   │   └── resolvers/
│   │   └── routes/                  # REST endpoints (health checks)
│   └── logs/                        # Application logs
├── client/                          # Frontend application
│   ├── src/
│   │   ├── app/                     # Next.js App Router pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             # Home page
│   │   │   ├── courses/
│   │   │   ├── login/
│   │   │   └── enrollment/
│   │   ├── components/              # React components
│   │   │   ├── ui/                  # Base UI components
│   │   │   ├── layout/              # Layout components
│   │   │   ├── course/              # Course-specific components
│   │   │   └── auth/                # Authentication components
│   │   ├── context/                 # React Context providers
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utilities and GraphQL client
│   │   └── types/                   # TypeScript type definitions
│   └── public/                      # Static assets
└── docs/                           # Project documentation
    ├── PROJECT_PLAN.md
    ├── IMPLEMENTATION_GUIDE.md
    └── TECHNICAL_SPECS.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation for significant changes

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues:**

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists and is accessible

**GraphQL Errors:**

- Check server logs in `server/logs/`
- Verify GraphQL schema syntax
- Ensure resolvers are properly implemented

**Frontend Build Issues:**

- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check environment variables

**Port Conflicts:**

- Backend default: 4000
- Frontend default: 3000
- Change ports in `.env` and `package.json` scripts if needed

### Debug Mode

```bash
# Backend debug
cd server
DEBUG=* npm run dev

# Frontend debug
cd client
NODE_OPTIONS='--inspect' npm run dev
```

## 📝 API Documentation

The GraphQL API is self-documenting. Once the server is running, visit:

- **GraphQL Playground**: `http://localhost:4000/graphql`
- **Schema Documentation**: Available in the playground's "Docs" tab

## 🔒 Security Considerations

- Mock authentication for development only
- Input validation on all GraphQL mutations
- Role-based access control for sensitive operations
- CORS configuration for production
- Environment variable protection

## 📊 Performance Considerations

- Database query optimization with Prisma
- GraphQL query depth limiting
- Apollo Client caching
- Next.js automatic code splitting
- Image optimization

## 🚀 Future Enhancements

- Real authentication with JWT
- File upload for course materials
- Email notifications
- Advanced search and filtering
- Course progress tracking
- Discussion forums
- Video content support
- Mobile app with React Native

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Built following modern full-stack development practices
- Inspired by popular EdTech platforms
- Uses best practices from the Node.js and React communities

---

**Built with ❤️ for the NexusHorizon Assessment**
