@echo off
echo Starting Women Safety Emergency Service...
echo ========================================

echo.
echo 1. Starting MongoDB...
net start MongoDB 2>nul
if %errorlevel% neq 0 (
    echo MongoDB service not found or already running
) else (
    echo MongoDB started successfully
)

echo.
echo 2. Starting Server...
cd server
start "Emergency Server" cmd /k "npm start"

echo.
echo 3. Waiting for server to start...
timeout /t 5 /nobreak >nul

echo.
echo 4. Starting Client...
cd ..\client
start "Emergency Client" cmd /k "npm start"

echo.
echo 5. Services started!
echo Server: http://localhost:5001
echo Client: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul