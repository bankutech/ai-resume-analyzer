@echo off
REM AI Resume Analyzer Setup Script for Windows
REM This script helps set up the project for first-time use

echo.
echo ========================================
echo   AI Resume Analyzer - Setup Script
echo ========================================
echo.

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found
node --version

REM Check Python
where py >nul 2>&1
if %errorlevel% neq 0 (
    where python >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Python is not installed. Please install Python first.
        echo Download from: https://www.python.org/
        pause
        exit /b 1
    )
    set PYTHON_CMD=python
) else (
    set PYTHON_CMD=py
)
echo [OK] Python found
%PYTHON_CMD% --version

REM Install frontend dependencies
echo.
echo [INFO] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed

REM Install backend dependencies
echo.
echo [INFO] Installing backend dependencies...
%PYTHON_CMD% -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed

REM Create uploads directory
echo.
echo [INFO] Creating uploads directory...
if not exist uploads mkdir uploads
echo [OK] Uploads directory created

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the application:
echo   1. Terminal 1: cd backend ^&^& py app.py
echo   2. Terminal 2: npm run dev
echo   3. Open: http://localhost:3000
echo.
pause
