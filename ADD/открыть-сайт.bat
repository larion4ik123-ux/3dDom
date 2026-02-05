@echo off
echo Открытие сайта в браузере...
echo.
cd /d "%~dp0"
start "" "index.html"
echo.
echo Сайт открыт в браузере!
echo.
echo Примечание: Если нужен локальный сервер, установите Python
echo или используйте расширение Live Server в VS Code
echo.
pause
