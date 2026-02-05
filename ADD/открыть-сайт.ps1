# Простой скрипт для открытия сайта
Write-Host "Открытие сайта в браузере..." -ForegroundColor Green
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Открываем index.html
$htmlPath = Join-Path $scriptPath "index.html"
if (Test-Path $htmlPath) {
    Start-Process $htmlPath
    Write-Host "Сайт открыт в браузере!" -ForegroundColor Green
} else {
    Write-Host "Ошибка: файл index.html не найден!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Примечание: Если нужен локальный сервер, установите Python" -ForegroundColor Yellow
Write-Host "или используйте расширение Live Server в VS Code" -ForegroundColor Yellow
Write-Host ""
