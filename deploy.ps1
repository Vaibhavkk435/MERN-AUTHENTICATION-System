# Production Deployment Script for Windows PowerShell

Write-Host "🔨 Building React application..." -ForegroundColor Green
Set-Location "client"
npm run build
Set-Location ".."

Write-Host "📁 Copying build files to server..." -ForegroundColor Green
Copy-Item "client\build\*" "server\public\" -Recurse -Force

Write-Host "🚀 Starting production server..." -ForegroundColor Green
Set-Location "server"
node server.js
