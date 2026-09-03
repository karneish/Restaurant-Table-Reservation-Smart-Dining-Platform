Write-Host "Checking TableHub service health..." -ForegroundColor Cyan
$services = @(
    @{ Name="Registry"; Url="http://localhost:8761/actuator/health" },
    @{ Name="Gateway"; Url="http://localhost:8080/actuator/health" },
    @{ Name="Auth"; Url="http://localhost:8081/actuator/health" },
    @{ Name="User"; Url="http://localhost:8082/actuator/health" },
    @{ Name="Restaurant"; Url="http://localhost:8083/actuator/health" },
    @{ Name="Table"; Url="http://localhost:8084/actuator/health" },
    @{ Name="Slot"; Url="http://localhost:8085/actuator/health" },
    @{ Name="Reservation"; Url="http://localhost:8086/actuator/health" },
    @{ Name="Payment"; Url="http://localhost:8087/actuator/health" },
    @{ Name="Notification"; Url="http://localhost:8088/actuator/health" }
)
$healthy=0; $unhealthy=0
foreach ($svc in $services) {
    try { $r = Invoke-RestMethod -Uri $svc.Url -TimeoutSec 5 -ErrorAction Stop
        if ($r.status -eq "UP") { Write-Host "[OK] $($svc.Name)" -ForegroundColor Green; $healthy++ }
        else { Write-Host "[WARN] $($svc.Name)" -ForegroundColor Yellow; $unhealthy++ }
    } catch { Write-Host "[FAIL] $($svc.Name)" -ForegroundColor Red; $unhealthy++ }
}
Write-Host "`nResults: $healthy healthy, $unhealthy unhealthy"
