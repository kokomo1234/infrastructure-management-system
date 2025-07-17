# Simple Migration API Test Script
param(
    [string]$BaseUrl = "https://hamciuca.com:8080"
)

$ApiBase = "$BaseUrl/api/migration"

Write-Host "🚀 Testing Migration API" -ForegroundColor Green
Write-Host "📊 Backend URL: $BaseUrl" -ForegroundColor Cyan

# Test 1: Check if API is accessible
Write-Host "`n🔍 Testing API accessibility..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$BaseUrl/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend is accessible!" -ForegroundColor Green
    Write-Host "Health response: $($healthResponse | ConvertTo-Json)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend not accessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Trying different URLs..." -ForegroundColor Yellow
    
    # Try without port
    try {
        $healthResponse = Invoke-RestMethod -Uri "https://hamciuca.com/api/health" -Method GET -TimeoutSec 10
        Write-Host "✅ Backend accessible at hamciuca.com!" -ForegroundColor Green
        $BaseUrl = "https://hamciuca.com"
        $ApiBase = "$BaseUrl/api/migration"
    } catch {
        Write-Host "❌ Backend not accessible at any URL" -ForegroundColor Red
        Write-Host "Please ensure your backend is deployed and accessible" -ForegroundColor Yellow
        exit 1
    }
}

# Test 2: Check migration status
Write-Host "`n🔍 Checking migration status..." -ForegroundColor Yellow
try {
    $statusResponse = Invoke-RestMethod -Uri "$ApiBase/status" -Method GET -TimeoutSec 10
    Write-Host "✅ Migration API is working!" -ForegroundColor Green
    Write-Host "Status: $($statusResponse | ConvertTo-Json -Depth 5)" -ForegroundColor Cyan
    
    # Check if migration is needed
    if ($statusResponse.data.completed) {
        Write-Host "✅ Migration already completed!" -ForegroundColor Green
    } elseif ($statusResponse.data.isRunning) {
        Write-Host "⚠️ Migration is currently running!" -ForegroundColor Yellow
    } else {
        Write-Host "📋 Migration is ready to execute" -ForegroundColor Cyan
        
        # Ask user if they want to execute
        $execute = Read-Host "Do you want to execute the migration? (y/N)"
        if ($execute -eq 'y' -or $execute -eq 'Y') {
            Write-Host "`n🚀 Executing migration..." -ForegroundColor Green
            try {
                $executeResponse = Invoke-RestMethod -Uri "$ApiBase/execute" -Method POST -ContentType "application/json" -TimeoutSec 30
                Write-Host "✅ Migration started!" -ForegroundColor Green
                Write-Host "Response: $($executeResponse | ConvertTo-Json)" -ForegroundColor Cyan
                
                # Monitor progress
                Write-Host "`n📊 Monitoring progress..." -ForegroundColor Yellow
                do {
                    Start-Sleep -Seconds 3
                    $progressResponse = Invoke-RestMethod -Uri "$ApiBase/status" -Method GET -TimeoutSec 10
                    
                    if ($progressResponse.data.progress -and $progressResponse.data.progress.Count -gt 0) {
                        $lastProgress = $progressResponse.data.progress[-1]
                        Write-Host "[$($lastProgress.timestamp)] $($lastProgress.step) - $($lastProgress.status)" -ForegroundColor Cyan
                    }
                    
                } while ($progressResponse.data.isRunning)
                
                Write-Host "✅ Migration completed!" -ForegroundColor Green
            } catch {
                Write-Host "❌ Migration execution failed: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    
} catch {
    Write-Host "❌ Migration API not accessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "The migration endpoints may not be deployed yet" -ForegroundColor Yellow
}

# Test 3: Verify migration (if completed)
Write-Host "`n🔍 Verifying migration results..." -ForegroundColor Yellow
try {
    $verifyResponse = Invoke-RestMethod -Uri "$ApiBase/verify" -Method GET -TimeoutSec 10
    Write-Host "✅ Verification successful!" -ForegroundColor Green
    Write-Host "Results: $($verifyResponse | ConvertTo-Json -Depth 5)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Verification failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Migration API test completed!" -ForegroundColor Green
