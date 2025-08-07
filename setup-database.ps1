# Database Setup Script for Local Development

Write-Host "Setting up local PostgreSQL database for NexusHorizon..." -ForegroundColor Green
Write-Host ""

# Database configuration
$dbName = "nexus_horizon_local"
$dbUser = "postgres"
$dbPassword = "postgres"

Write-Host "Creating database: $dbName" -ForegroundColor Blue

try {
    # Create database using psql
    $createDbCommand = "CREATE DATABASE $dbName;"
    
    # Try to create the database
    $output = psql -U $dbUser -h localhost -c $createDbCommand postgres 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database created successfully!" -ForegroundColor Green
    } else {
        # Check if database already exists
        if ($output -like "*already exists*") {
            Write-Host "Database already exists - skipping creation" -ForegroundColor Yellow
        } else {
            Write-Host "Error creating database: $output" -ForegroundColor Red
            throw "Database creation failed"
        }
    }
    
    Write-Host ""
    Write-Host "Running Prisma migrations..." -ForegroundColor Blue
    
    # Navigate to server directory and run migrations
    Set-Location "$PSScriptRoot\server"
    
    # Generate Prisma client
    Write-Host "Generating Prisma client..." -ForegroundColor Blue
    npx prisma generate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Prisma client generated successfully!" -ForegroundColor Green
    } else {
        throw "Failed to generate Prisma client"
    }
    
    # Run database migrations
    Write-Host "Running database migrations..." -ForegroundColor Blue
    npx prisma migrate dev --name init
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database migrations completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Migration may have failed or no changes detected" -ForegroundColor Yellow
    }
    
    # Optional: Seed the database
    Write-Host ""
    $seedChoice = Read-Host "Would you like to seed the database with sample data? (y/n)"
    if ($seedChoice -eq 'y' -or $seedChoice -eq 'Y') {
        Write-Host "Seeding database..." -ForegroundColor Blue
        npm run db:seed
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Database seeded successfully!" -ForegroundColor Green
        } else {
            Write-Host "Database seeding failed or no seed script available" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "Database setup completed!" -ForegroundColor Green
    Write-Host "Database URL: postgresql://postgres:postgres@localhost:5432/nexus_horizon_local" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You can now start the application using start-local.ps1" -ForegroundColor Yellow
    
} catch {
    Write-Host ""
    Write-Host "Setup failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual setup steps:" -ForegroundColor Yellow
    Write-Host "1. Make sure PostgreSQL is installed and running" -ForegroundColor White
    Write-Host "2. Connect to PostgreSQL: psql -U postgres" -ForegroundColor White
    Write-Host "3. Create database: CREATE DATABASE nexus_horizon_local;" -ForegroundColor White
    Write-Host "4. Exit psql: \q" -ForegroundColor White
    Write-Host "5. Run: cd server && npm run db:migrate" -ForegroundColor White
}

Set-Location $PSScriptRoot
Read-Host "Press Enter to exit"
