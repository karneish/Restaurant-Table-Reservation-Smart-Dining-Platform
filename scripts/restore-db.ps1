param([Parameter(Mandatory=$true)][string]$BackupFile)
if (-not (Test-Path $BackupFile)) { Write-Host "File not found: $BackupFile" -ForegroundColor Red; exit 1 }
$confirm = Read-Host "This will OVERWRITE the database. Continue? (y/N)"
if ($confirm -ne 'y') { Write-Host "Cancelled." -ForegroundColor Yellow; exit 0 }
docker compose exec -T postgres psql -U ticket_user ticket_booking_system_db < $BackupFile
if ($LASTEXITCODE -eq 0) { Write-Host "Restore completed!" -ForegroundColor Green }
else { Write-Host "Restore failed!" -ForegroundColor Red }
