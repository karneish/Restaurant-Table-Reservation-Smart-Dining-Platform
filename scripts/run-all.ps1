$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent

Write-Host "=== Starting Ticket Booking System (Docker + PostgreSQL) ===" -ForegroundColor Cyan
Write-Host "This will build all microservices and the frontend as Docker images," -ForegroundColor Yellow
Write-Host "then start PostgreSQL 18 (ticket_booking_system_db) + pgAdmin4 + all services." -ForegroundColor Yellow

Set-Location $Root
docker compose up --build -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nDocker Compose failed. Check the error above." -ForegroundColor Red
    exit 1
}

Write-Host "`nWaiting for services to become healthy..." -ForegroundColor Cyan
Start-Sleep -Seconds 30
docker compose ps

Write-Host "`nAll services started!" -ForegroundColor Green
Write-Host "  Frontend:         http://localhost:3000"
Write-Host "  API Gateway:      http://localhost:8080"
Write-Host "  Service Registry: http://localhost:8761"
Write-Host "  pgAdmin4:         http://localhost:5051  (admin@ticketbooking.com / root123)"
Write-Host "  PostgreSQL 18:    localhost:5433  db=ticket_booking_system_db  user=ticket_user  pass=root123"

Write-Host "`nCommands:"
Write-Host "  View logs:      docker compose logs -f"
Write-Host "  Stop services:  docker compose down"
Write-Host "  Reset data:     docker compose down -v"
