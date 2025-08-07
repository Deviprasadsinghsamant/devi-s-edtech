# Devi's EdTech Learning Platform

A modern full-stack learning platform built with GraphQL API, role-based access control, and course management system.

## 🚀 Quick Local Setup

For running the complete system locally with local database:

### Automated Setup (Windows)

1. **Run the database setup script:**
   ```powershell
   .\setup-database.ps1
   ```

2. **Start both servers:**
   ```powershell
   .\start-local.ps1
   ```
   Or use the batch file:
   ```cmd
   start-local.bat
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend GraphQL: http://localhost:4000/graphql

### Manual Setup

See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for detailed manual setup instructions.

## Project Overview

This is a comprehensive EdTech platform that allows students to browse and enroll in courses, and professors to manage their course offerings. The platform features a modern React frontend with Next.js and a robust Node.js backend with GraphQL API.

## Technology Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Language**: TypeScript 4.9+
- **GraphQL**: Apollo Server 3.12+
- **Database**: PostgreSQL 14+
- **ORM**: Prisma ORM 4.15+
- **Authentication**: Mock JWT-style with localStorage

### Frontend

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.3+
- **State Management**: React Context API
- **GraphQL Client**: Apollo Client 3.7+

## Architecture

The project follows a layered architecture pattern:

```
Backend: Routes → Controllers → Services → DAOs → Models
Frontend: Pages → Components → Context → GraphQL Client
```

## Quick Start

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm package manager

### Installation & Setup

1. **Backend Setup**

   ```bash
   cd server
   npm install
   # Create database 'devi_edtech_db' in PostgreSQL
   npx prisma migrate dev
   npx prisma db seed
   npm run dev  # Runs on http://localhost:4000
   ```

2. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev  # Runs on http://localhost:3000
   ```

## Demo Accounts

- **Student**: john@example.com
- **Professor**: jane@example.com

## Key Features

✅ **Complete Full-Stack Application**

- GraphQL API with Apollo Server
- Next.js frontend with TypeScript
- PostgreSQL database with Prisma ORM
- Role-based authentication system

✅ **Course Management System**

- Browse courses with filtering and search
- Student enrollment functionality
- Course statistics and metrics
- Real-time data updates

✅ **Modern UI/UX**

- Responsive design with Tailwind CSS
- Loading states and error handling
- Clean, intuitive interface
- Type-safe development with TypeScript

## Project Structure

```
nexusHorizon-assessment/
├── server/              # Backend GraphQL API
│   ├── src/
│   │   ├── daos/       # Data Access Objects
│   │   ├── services/   # Business Logic
│   │   ├── graphql/    # Schema & Resolvers
│   │   └── common/     # Utilities
│   └── prisma/         # Database Schema
├── client/              # Frontend Next.js App
│   ├── src/
│   │   ├── app/        # Pages (App Router)
│   │   ├── components/ # UI Components
│   │   ├── context/    # State Management
│   │   └── lib/        # GraphQL Client
└── README.md
```

## Development Status

🚀 **Fully Functional** - Both frontend and backend are complete and running successfully with all core features implemented including authentication, course management, and responsive UI.

---

_Built for NexusHorizon Assessment - A demonstration of modern full-stack development capabilities._
