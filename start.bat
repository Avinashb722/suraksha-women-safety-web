@echo off
echo Installing and starting Women Safety App...

echo Installing server dependencies...
cd server
call npm install

echo Starting server...
start "Server" cmd /k "npm start"

echo Installing client dependencies...
cd ..\client
call npm install

echo Starting client...
start "Client" cmd /k "npm start"

echo Both services started!
pause