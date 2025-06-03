#!/bin/bash

# SSGB Engineering College Management System Setup Script

echo "========================================="
echo "SSGB Engineering College Management System"
echo "Setting up the application..."
echo "========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install backend dependencies"
    exit 1
fi
echo "Backend dependencies installed successfully!"
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install frontend dependencies"
    exit 1
fi
echo "Frontend dependencies installed successfully!"
echo ""

# Go back to root directory
cd ..

echo "========================================="
echo "Setup completed successfully!"
echo "========================================="
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "Or use the start.sh script to run both simultaneously"
echo ""
echo "Default admin credentials:"
echo "Email: admin@ssgb.edu"
echo "Password: admin123"
echo ""
echo "Make sure to:"
echo "1. Configure your MongoDB URI in backend/.env"
echo "2. Seed the admin user: cd backend && node scripts/seedAdmin.js"
echo "3. Change the default password after first login"
echo "========================================="
