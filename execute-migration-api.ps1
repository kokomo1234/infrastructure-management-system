# =====================================================
# Database Migration Execution Script
# =====================================================
# This script executes the database migration via API calls

param(
    [string]$BaseUrl = "https://hamciuca.com",
    [switch]$Help
)

if ($Help) {
    Write-Host "Database Migration Execution Script" -ForegroundColor Green
    Write-Host "Usage: .\execute-migration-api.ps1 [-BaseUrl <url>]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Parameters:"
    Write-Host "  -BaseUrl    Backend URL (default: https://hamciuca.com)"
    Write-Host "  -Help       Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\execute-migration-api.ps1"
    Write-Host "  .\execute-migration-api.ps1 -BaseUrl https://your-backend.com"
    exit
}

$ApiBase = "$BaseUrl/api/migration"

Write-Host "🚀 Database Migration Execution" -ForegroundColor Green
Write-Host "📊 Backend URL: $BaseUrl" -ForegroundColor Cyan
Write-Host ""

# Function to make API calls with error handling
function Invoke-MigrationApi {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [hashtable]$Body = $null
    )
    
    try {
        $uri = "$ApiBase/$Endpoint"
        Write-Host "📡 Calling: $Method $uri" -ForegroundColor Yellow
        
        $params = @{
            Uri = $uri
            Method = $Method
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        }
        return $null
    }
}

# Function to display status
function Show-MigrationStatus {
    param($status)
    
    if (-not $status) { return }
    
    Write-Host "📊 Migration Status:" -ForegroundColor Cyan
    Write-Host "  Running: $($status.data.isRunning)" -ForegroundColor $(if ($status.data.isRunning) { "Yellow" } else { "Green" })
    Write-Host "  Completed: $($status.data.completed)" -ForegroundColor $(if ($status.data.completed) { "Green" } else { "Gray" })
    
    if ($status.data.error) {
        Write-Host "  Error: $($status.data.error)" -ForegroundColor Red
    }
    
    if ($status.data.startTime) {
        Write-Host "  Started: $($status.data.startTime)" -ForegroundColor Gray
    }
    
    if ($status.data.endTime) {
        Write-Host "  Completed: $($status.data.endTime)" -ForegroundColor Gray
    }
    
    Write-Host ""
}

# Function to display progress
function Show-Progress {
    param($progress)
    
    if (-not $progress -or $progress.Count -eq 0) { return }
    
    Write-Host "📝 Migration Progress:" -ForegroundColor Cyan
    foreach ($item in $progress) {
        $color = switch ($item.status) {
            "success" { "Green" }
            "error" { "Red" }
            "running" { "Yellow" }
            default { "Gray" }
        }
        
        $timestamp = [DateTime]::Parse($item.timestamp).ToString("HH:mm:ss")
        Write-Host "  [$timestamp] $($item.step)" -ForegroundColor $color
        
        if ($item.error) {
            Write-Host "    Error: $($item.error)" -ForegroundColor Red
        }
    }
    Write-Host ""
}

# Step 1: Check current status
Write-Host "🔍 Step 1: Checking current migration status..." -ForegroundColor Blue
$status = Invoke-MigrationApi -Endpoint "status"

if ($status) {
    Show-MigrationStatus $status
    
    if ($status.data.completed) {
        Write-Host "✅ Migration already completed!" -ForegroundColor Green
        Write-Host "🎯 Proceeding to verification..." -ForegroundColor Cyan
    }
    elseif ($status.data.isRunning) {
        Write-Host "⚠️  Migration is currently running!" -ForegroundColor Yellow
        Write-Host "📊 Monitoring progress..." -ForegroundColor Cyan
        
        # Monitor progress
        do {
            Start-Sleep -Seconds 3
            $status = Invoke-MigrationApi -Endpoint "status"
            if ($status) {
                Show-Progress $status.data.progress
            }
        } while ($status -and $status.data.isRunning)
        
        Write-Host "✅ Migration monitoring completed!" -ForegroundColor Green
    }
    else {
        # Step 2: Execute migration
        Write-Host "🚀 Step 2: Executing database migration..." -ForegroundColor Blue
        
        $confirmation = Read-Host "Are you sure you want to execute the database migration? (y/N)"
        if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
            $executeResult = Invoke-MigrationApi -Endpoint "execute" -Method "POST"
            
            if ($executeResult) {
                Write-Host "✅ Migration started successfully!" -ForegroundColor Green
                Write-Host "📊 Migration ID: $($executeResult.data.migrationId)" -ForegroundColor Cyan
                
                # Monitor progress
                Write-Host "📊 Monitoring migration progress..." -ForegroundColor Cyan
                do {
                    Start-Sleep -Seconds 2
                    $status = Invoke-MigrationApi -Endpoint "status"
                    if ($status) {
                        Show-Progress $status.data.progress
                    }
                } while ($status -and $status.data.isRunning)
                
                Write-Host "✅ Migration execution completed!" -ForegroundColor Green
            }
        }
        else {
            Write-Host "❌ Migration cancelled by user" -ForegroundColor Yellow
            exit
        }
    }
}

# Step 3: Verify migration results
Write-Host "🔍 Step 3: Verifying migration results..." -ForegroundColor Blue
$verification = Invoke-MigrationApi -Endpoint "verify"

if ($verification) {
    Write-Host "✅ Verification Results:" -ForegroundColor Green
    Write-Host "  TDL Columns: $($verification.data.tdl_columns)" -ForegroundColor Cyan
    Write-Host "  AC Columns: $($verification.data.ac_columns)" -ForegroundColor Cyan
    Write-Host "  New Tables: $($verification.data.new_tables -join ', ')" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📊 Data Counts:" -ForegroundColor Cyan
    Write-Host "  TDL Sites: $($verification.data.data_counts.tdl_count)" -ForegroundColor Gray
    Write-Host "  AC Equipment: $($verification.data.data_counts.ac_count)" -ForegroundColor Gray
    Write-Host "  DC Systems: $($verification.data.data_counts.dc_count)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔗 TDL-AC Relationship Test:" -ForegroundColor Cyan
    foreach ($rel in $verification.data.relationship_test) {
        Write-Host "  $($rel.name): $($rel.equipment_count) equipment" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "🎉 MIGRATION COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "🚀 Your database is now enhanced and ready for both frontends!" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Test your current frontend - should work with enhanced features"
Write-Host "  2. Deploy your new modern frontend"
Write-Host "  3. Enjoy the enhanced infrastructure management system!"
Write-Host ""
