@echo off
echo Building React application...
cd client
call npm run build
cd ..

echo Copying build files to server...
xcopy "client\build\*" "server\public\" /E /H /C /I /Y

echo Starting production server...
cd server
node server.js
