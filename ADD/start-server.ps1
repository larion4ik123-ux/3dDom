# Скрипт для запуска локального сервера
Write-Host "Запуск локального сервера..." -ForegroundColor Green
Write-Host ""
Write-Host "Сайт будет доступен по адресу: http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Нажмите Ctrl+C чтобы остановить сервер" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Проверка наличия Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Найден: $pythonVersion" -ForegroundColor Green
    Write-Host ""
    
    # Запуск сервера
    python -m http.server 8000
} catch {
    Write-Host "Ошибка: Python не найден!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Альтернативные варианты:" -ForegroundColor Yellow
    Write-Host "1. Установите Python с https://www.python.org/" -ForegroundColor White
    Write-Host "2. Или откройте index.html напрямую в браузере" -ForegroundColor White
    Write-Host ""
    pause
}
