param([switch]$Force)
if (-not $Force) { $c = Read-Host "This will DELETE ALL DATA. Continue? (y/N)"; if ($c -ne 'y') { exit 0 } }
Write-Host "Resetting database..." -ForegroundColor Cyan
docker compose exec -T postgres psql -U ticket_user -d postgres -c "DROP DATABASE IF EXISTS ticket_booking_system_db;"
docker compose exec -T postgres psql -U ticket_user -d postgres -c "CREATE DATABASE ticket_booking_system_db;"
docker compose restart auth-service user-service restaurant-service table-service slot-service reservation-service payment-service notification-service
Write-Host "Reset complete! Services re-seeding." -ForegroundColor Green
