# Manual Migration Commands

## Prerequisites
Make sure your backend is deployed and accessible at your domain.

## Step 1: Check Migration Status
```powershell
$response = Invoke-RestMethod -Uri "https://hamciuca.com/api/migration/status" -Method GET
$response | ConvertTo-Json -Depth 10
```

## Step 2: Execute Migration
```powershell
$response = Invoke-RestMethod -Uri "https://hamciuca.com/api/migration/execute" -Method POST -ContentType "application/json"
$response | ConvertTo-Json -Depth 10
```

## Step 3: Monitor Progress (repeat until completed)
```powershell
$status = Invoke-RestMethod -Uri "https://hamciuca.com/api/migration/status" -Method GET
Write-Host "Running: $($status.data.isRunning)"
Write-Host "Completed: $($status.data.completed)"
if ($status.data.progress) {
    $status.data.progress | ForEach-Object {
        Write-Host "[$($_.timestamp)] $($_.step) - $($_.status)"
    }
}
```

## Step 4: Verify Results
```powershell
$verification = Invoke-RestMethod -Uri "https://hamciuca.com/api/migration/verify" -Method GET
$verification.data | ConvertTo-Json -Depth 10
```

## Alternative: Use the PowerShell Script
```powershell
.\execute-migration-api.ps1 -BaseUrl "https://hamciuca.com"
```

## If Backend is Local
```powershell
.\execute-migration-api.ps1 -BaseUrl "http://localhost:8080"
```
