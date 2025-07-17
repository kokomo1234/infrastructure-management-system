# Simple Migration Test
Write-Host "🚀 Testing Migration API" -ForegroundColor Green

# Test different URLs
$urls = @(
    "https://hamciuca.com:8080",
    "https://hamciuca.com",
    "http://hamciuca.com:8080",
    "http://hamciuca.com"
)

$workingUrl = $null

foreach ($url in $urls) {
    Write-Host "Testing: $url" -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$url/api/health" -Method GET -TimeoutSec 5
        Write-Host "✅ Success at: $url" -ForegroundColor Green
        $workingUrl = $url
        break
    } catch {
        Write-Host "❌ Failed: $url" -ForegroundColor Red
    }
}

if ($workingUrl) {
    Write-Host "`n🎯 Using working URL: $workingUrl" -ForegroundColor Cyan
    
    # Test migration status
    Write-Host "Checking migration status..." -ForegroundColor Yellow
    try {
        $status = Invoke-RestMethod -Uri "$workingUrl/api/migration/status" -Method GET -TimeoutSec 10
        Write-Host "Migration Status:" -ForegroundColor Green
        $status | ConvertTo-Json -Depth 3
        
        # If not completed, ask to execute
        if (-not $status.data.completed -and -not $status.data.isRunning) {
            $execute = Read-Host "`nExecute migration? (y/N)"
            if ($execute -eq 'y') {
                Write-Host "Executing migration..." -ForegroundColor Green
                $result = Invoke-RestMethod -Uri "$workingUrl/api/migration/execute" -Method POST -ContentType "application/json"
                $result | ConvertTo-Json
            }
        }
        
    } catch {
        Write-Host "Migration API not available: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} else {
    Write-Host "❌ No working backend URL found" -ForegroundColor Red
    Write-Host "Please ensure your backend is deployed and accessible" -ForegroundColor Yellow
}
