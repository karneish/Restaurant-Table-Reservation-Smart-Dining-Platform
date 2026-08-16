$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent

# Locate Maven (fall back to PATH if MAVEN_HOME is not set)
if ($env:MAVEN_HOME -and (Test-Path "$env:MAVEN_HOME\bin\mvn.cmd")) {
    $mvn = "$env:MAVEN_HOME\bin\mvn.cmd"
} elseif (Get-Command mvn -ErrorAction SilentlyContinue) {
    $mvn = (Get-Command mvn).Source
} else {
    Write-Host "Maven not found. Install Maven 3.9+ or set MAVEN_HOME." -ForegroundColor Red
    exit 1
}
Write-Host "Using Maven: $mvn" -ForegroundColor Cyan

Write-Host "=== Building Backend Services ===" -ForegroundColor Cyan
Push-Location (Join-Path $Root "services")
& $mvn clean install -DskipTests
$code = $LASTEXITCODE
Pop-Location
if ($code -ne 0) {
    Write-Host "Backend build FAILED" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Building Frontend ===" -ForegroundColor Cyan
Push-Location (Join-Path $Root "frontend")
npm install --silent
npm run build
$code = $LASTEXITCODE
Pop-Location
if ($code -ne 0) {
    Write-Host "Frontend build FAILED" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Build Complete ===" -ForegroundColor Green
