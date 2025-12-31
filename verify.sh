#!/bin/bash

# Verification Script for HomeVisit Helper

echo "🔍 Starting Project Verification..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js could not be found. Please install Node.js (v18+) first."
    exit 1
fi
echo "✅ Node.js found: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Dependencies installation failed."
    exit 1
fi

# Build project to check for errors
echo "🏗️  Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
echo "✅ Build successful!"

# Start Dev Server
echo "🚀 Starting development server..."
echo "Please open the URL shown below in your browser."
npm run dev
