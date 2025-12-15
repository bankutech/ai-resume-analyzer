#!/bin/bash

# AI Resume Analyzer Setup Script
# This script helps set up the project for first-time use

echo "AI Resume Analyzer - Setup Script"
echo "======================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi
echo "Success: Node.js found: $(node --version)"

# Check Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "Error: Python is not installed. Please install Python first."
    exit 1
fi
echo "Success: Python found: $(python3 --version 2>/dev/null || python --version)"

# Install frontend dependencies
echo ""
echo " Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
python3 -m pip install -r requirements.txt 2>/dev/null || python -m pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Create uploads directory
echo ""
echo "📁 Creating uploads directory..."
mkdir -p uploads
echo "✅ Uploads directory created"

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Terminal 1: cd backend && python app.py"
echo "  2. Terminal 2: npm run dev"
echo "  3. Open: http://localhost:3000"
echo ""
