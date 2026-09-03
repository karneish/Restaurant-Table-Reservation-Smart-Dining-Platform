param([string]$Service="all")
if ($Service -eq "all") { docker compose restart }
else { docker compose restart $Service }
Write-Host "Waiting for services..." -ForegroundColor Gray; Start-Sleep -Seconds 5
@("http://localhost:8080/actuator/health","http://localhost:8761/actuator/health") | ForEach-Object {
    try { Invoke-RestMethod -Uri $_ -TimeoutSec 10 -ErrorAction Stop; Write-Host "[OK] $_" -ForegroundColor Green }
    catch { Write-Host "[WAIT] $_" -ForegroundColor Yellow }
}
