param([string]$Service="all", [int]$Lines=50)
if ($Service -eq "all") { docker compose logs --tail=$Lines -f }
else { docker compose logs --tail=$Lines -f $Service }
