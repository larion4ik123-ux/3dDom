@echo off
echo Запуск локального сервера...
echo.
echo Сайт будет доступен по адресу: http://localhost:8000
echo.
echo Нажмите Ctrl+C чтобы остановить сервер
echo.

cd /d "%~dp0"
python -m http.server 8000

pause
