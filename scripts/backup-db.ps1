param([string]$OutputDir="./backups")
$ts = Get-Date -Format "yyyyMMdd_HHmmss"
$file = "$OutputDir/tablehub_$ts.sql"
if (-not (Test-Path $OutputDir)) { New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null }
Write-Host "Backing up database..." -ForegroundColor Cyan
docker compose exec -T postgres pg_dump -U ticket_user ticket_booking_system_db > $file
if ($LASTEXITCODE -eq 0) { Write-Host "Backup completed: $file" -ForegroundColor Green }
else { Write-Host "Backup failed!" -ForegroundColor Red }
