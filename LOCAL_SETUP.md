# Local Development Setup Guide

This guide will help you set up the NexusHorizon system to run completely locally with a local database, backend, and frontend.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v12 or higher) installed and running locally
3. **npm** or **yarn** package manager

## Database Setup

### 1. Install and Start PostgreSQL

Make sure PostgreSQL is installed and running on your machine:

```bash
# On Windows (if using PostgreSQL installer)
# PostgreSQL should be running as a service

# On macOS with Homebrew
brew services start postgresql

# On Ubuntu/Debian
sudo service postgresql start
```

### 2. Create Local Database

Connect to PostgreSQL and create the database:

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create the database
CREATE DATABASE nexus_horizon_local;

# Create a user (optional, or use existing postgres user)
CREATE USER nexus_user WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE nexus_horizon_local TO nexus_user;

# Exit psql
\q
```

## Backend Setup

### 1. Navigate to Server Directory

```bash
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The `.env` file is already configured for local development:
- Database: `postgresql://postgres:postgres@localhost:5432/nexus_horizon_local`
- Server Port: `4000`
- CORS: Allows requests from `http://localhost:3000`

If you need to change the database password, update the `DATABASE_URL` in the `.env` file.

### 4. Run Database Migrations

```bash
npm run db:migrate
```

### 5. Seed the Database (Optional)

```bash
npm run db:seed
```

### 6. Start the Backend Server

```bash
npm run dev
```

The backend will be running at `http://localhost:4000`
GraphQL Playground will be available at `http://localhost:4000/graphql`

## Frontend Setup

### 1. Navigate to Client Directory

```bash
cd client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The `.env.local` file is already configured to point to your local backend:
- GraphQL URI: `http://localhost:4000/graphql`

### 4. Start the Frontend

```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

## Running the Complete System

1. **Terminal 1** - Start the backend:
   ```bash
   cd server
   npm run dev
   ```

2. **Terminal 2** - Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Database Management

### View Database with Prisma Studio

```bash
cd server
npm run db:studio
```

This will open Prisma Studio at `http://localhost:5555` where you can view and edit your database records.

### Reset Database (if needed)

```bash
cd server
npx prisma migrate reset
npm run db:seed
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Make sure PostgreSQL is running
   - Check the database name and credentials in `.env`
   - Ensure the database `nexus_horizon_local` exists

2. **Port Already in Use**
   - Backend (4000): Change `PORT` in `server/.env`
   - Frontend (3000): Run with `npm run dev -- -p 3001`

3. **CORS Issues**
   - Ensure `CORS_ORIGIN` in `server/.env` matches your frontend URL

4. **GraphQL Endpoint Not Found**
   - Verify the backend is running on port 4000
   - Check `NEXT_PUBLIC_GRAPHQL_URI` in `client/.env.local`

## Development Scripts

### Backend (`server/` directory)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Frontend (`client/` directory)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
