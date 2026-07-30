Write-Host "=== Building All Services ===" -ForegroundColor Cyan

$services = @(
  "common",
  "service-registry",
  "config-server",
  "api-gateway",
  "auth-service",
  "user-service",
  "movie-service",
  "theatre-service",
  "show-service",
  "booking-service",
  "payment-service",
  "notification-service"
)

foreach ($svc in $services) {
  Write-Host "`nBuilding $svc..." -ForegroundColor Yellow
  $path = Join-Path "services" $svc
  Push-Location $path
  & "C:\Users\ManaGenz\.m2\wrapper\dists\maven-wrapper\3.2.0\mvnw.cmd" clean package -DskipTests -q
  if ($LASTEXITCODE -eq 0) {
    Write-Host "$svc built successfully" -ForegroundColor Green
  } else {
    Write-Host "$svc build FAILED" -ForegroundColor Red
  }
  Pop-Location
}

Write-Host "`n=== Building Frontend ===" -ForegroundColor Cyan
Push-Location "frontend"
npm install --silent
npm run build
if ($LASTEXITCODE -eq 0) {
  Write-Host "Frontend built successfully" -ForegroundColor Green
} else {
  Write-Host "Frontend build FAILED" -ForegroundColor Red
}
Pop-Location

Write-Host "`n=== Build Complete ===" -ForegroundColor Cyan
