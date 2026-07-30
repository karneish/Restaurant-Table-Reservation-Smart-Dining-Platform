Write-Host "=== Starting All Services ===" -ForegroundColor Cyan

$jobs = @()

# Start Service Registry
Write-Host "Starting Service Registry..." -ForegroundColor Yellow
$jobs += Start-Job -ScriptBlock {
  Set-Location "C:\Users\ManaGenz\Desktop\ticket-booking-system\services\service-registry"
  & ".\mvnw.cmd" spring-boot:run -q
}

Start-Sleep -Seconds 15

# Start Config Server
Write-Host "Starting Config Server..." -ForegroundColor Yellow
$jobs += Start-Job -ScriptBlock {
  Set-Location "C:\Users\ManaGenz\Desktop\ticket-booking-system\services\config-server"
  & ".\mvnw.cmd" spring-boot:run -q
}

Start-Sleep -Seconds 10

# Start API Gateway
Write-Host "Starting API Gateway..." -ForegroundColor Yellow
$jobs += Start-Job -ScriptBlock {
  Set-Location "C:\Users\ManaGenz\Desktop\ticket-booking-system\services\api-gateway"
  & ".\mvnw.cmd" spring-boot:run -q
}

# Start all business services in parallel
$businessServices = @("auth-service", "user-service", "movie-service", "theatre-service", "show-service", "booking-service", "payment-service", "notification-service")
foreach ($svc in $businessServices) {
  Write-Host "Starting $svc..." -ForegroundColor Yellow
  $jobs += Start-Job -ScriptBlock {
    param($name)
    Set-Location "C:\Users\ManaGenz\Desktop\ticket-booking-system\services\$name"
    & ".\mvnw.cmd" spring-boot:run -q
  } -ArgumentList $svc
}

Write-Host "`n=== Starting Frontend ===" -ForegroundColor Yellow
$jobs += Start-Job -ScriptBlock {
  Set-Location "C:\Users\ManaGenz\Desktop\ticket-booking-system\frontend"
  npm run dev
}

Write-Host "`nAll services started! Check the status below:" -ForegroundColor Green
Write-Host "Service Registry: http://localhost:8761" -ForegroundColor Cyan
Write-Host "Config Server:    http://localhost:8888" -ForegroundColor Cyan
Write-Host "API Gateway:      http://localhost:8080" -ForegroundColor Cyan
Write-Host "Auth Service:     http://localhost:8081" -ForegroundColor Cyan
Write-Host "Frontend:          http://localhost:5173" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop all services" -ForegroundColor Yellow

# Wait for all jobs
$jobs | Wait-Job | Out-Null
