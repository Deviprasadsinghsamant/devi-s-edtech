#!/bin/bash

# Database migration script for Render deployment
echo "Starting database migration..."

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Seed the database (optional)
echo "Seeding database..."
npm run db:seed

echo "Database setup complete!"
