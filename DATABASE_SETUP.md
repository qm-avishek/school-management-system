# Database Configuration Guide

## Option 1: MongoDB Atlas (Recommended for Quick Start)

MongoDB Atlas is a free cloud database service that's perfect for development and testing.

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose the free tier (M0)

### Step 2: Create a Cluster
1. After login, click "Build a Database"
2. Choose "M0 FREE" tier
3. Select a cloud provider and region (choose closest to you)
4. Name your cluster (e.g., "ssgb-college")
5. Click "Create"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and password (remember these!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

### Step 6: Update .env File
1. Open `backend/.env`
2. Replace the MONGODB_URI with your connection string:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/ssgb_college?retryWrites=true&w=majority
```

## Option 2: Local MongoDB Installation

### Windows
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
4. Update .env file:
   ```
   MONGODB_URI=mongodb://localhost:27017/ssgb_college
   ```

### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Ubuntu/Linux
```bash
# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Verification

After setting up your database, test the connection:

```powershell
cd backend
npm run seed
```

If successful, you should see:
```
Connected to MongoDB
Initial admin user created successfully
Email: admin@ssgb.edu
Password: admin123
```

## Troubleshooting

### Connection Issues
- Check your internet connection (for Atlas)
- Verify connection string is correct
- Ensure IP is whitelisted (for Atlas)
- Check if MongoDB service is running (for local)

### Authentication Errors
- Verify username and password
- Check user permissions in Atlas
- Ensure database name matches

### Network Issues
- For Atlas: Add current IP to whitelist
- For local: Check if port 27017 is blocked

## Security Notes

- Never commit real database credentials to version control
- Use environment variables for sensitive data
- Regularly rotate database passwords
- Use strong, unique passwords
- In production, restrict IP access to your server only
