# Monitor DeepSeek token usage
Write-Host "=== DeepSeek Monitor ===" -ForegroundColor Cyan
Write-Host "Watching for model activity...`n" -ForegroundColor Yellow

while ($true) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:11434/api/ps" -Method Get
        
        Clear-Host
        Write-Host "=== Ollama Status ($(Get-Date -Format 'HH:mm:ss')) ===" -ForegroundColor Cyan
        
        if ($response.models) {
            foreach ($model in $response.models) {
                Write-Host "`nModel: $($model.name)" -ForegroundColor Green
                Write-Host "Size in VRAM: $([math]::Round($model.size_vram / 1GB, 2)) GB"
                Write-Host "Until: $($model.expires_at)"
            }
        } else {
            Write-Host "No models currently loaded" -ForegroundColor Gray
        }
        
        Start-Sleep -Seconds 2
    }
    catch {
        Write-Host "Error: $_" -ForegroundColor Red
        Start-Sleep -Seconds 5
    }
}