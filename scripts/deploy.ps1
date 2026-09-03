param([switch]$SkipBuild, [switch]$Production)
$ErrorActionPreference = "Stop"; $start = Get-Date
Write-Host "=== TableHub Deployment ===" -ForegroundColor Cyan
if (-not $SkipBuild) { Write-Host "[1/4] Building..." -ForegroundColor Yellow; .\scripts\build-all.ps1 }
Write-Host "[2/4] Stopping existing..." -ForegroundColor Yellow; docker compose down 2>$null
Write-Host "[3/4] Starting services..." -ForegroundColor Yellow; docker compose up -d --build
Write-Host "[4/4] Verifying..." -ForegroundColor Yellow; Start-Sleep -Seconds 10; .\scripts\health-check.ps1
$d = (Get-Date) - $start
Write-Host "`nDeployed in $($d.TotalSeconds.ToString('F1'))s | http://localhost:3000" -ForegroundColor Green
