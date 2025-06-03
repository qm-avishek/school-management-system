# MongoDB Atlas Connection Troubleshooting Guide

## Current Status
- ✅ Backend server is running on port 5000
- ✅ Frontend React app is running on port 3000
- ✅ Application UI is accessible at http://localhost:3000
- ❌ MongoDB Atlas connection is failing with DNS error

## Error Details
```
Error: querySrv EREFUSED _mongodb._tcp.cluster0.b4et8vg.mongodb.net
```

This is a DNS resolution error that typically occurs due to network connectivity issues.

## Troubleshooting Steps

### Step 1: Verify MongoDB Atlas Cluster Status
1. Log into MongoDB Atlas (https://cloud.mongodb.com)
2. Check if your cluster "Cluster0" is running (green status)
3. Verify the cluster region and configuration

### Step 2: Check Network Connectivity
Run these commands in PowerShell to test connectivity:

```powershell
# Test DNS resolution
nslookup cluster0.b4et8vg.mongodb.net

# Test if the host is reachable
ping cluster0.b4et8vg.mongodb.net

# Test port connectivity
Test-NetConnection cluster0.b4et8vg.mongodb.net -Port 27017
```

### Step 3: Verify IP Whitelist
1. In MongoDB Atlas, go to Security → Network Access
2. Add your current IP address: 0.0.0.0/0 (for testing) or your specific IP
3. Wait a few minutes for the changes to propagate

### Step 4: Check Connection String
Your current connection string:
```
mongodb+srv://sateesh:QFeIYaDqLgcikMPl@cluster0.b4et8vg.mongodb.net/ssgb_college?retryWrites=true&w=majority&appName=Cluster0
```

Verify:
- Username: sateesh
- Password: QFeIYaDqLgcikMPl
- Cluster: cluster0.b4et8vg.mongodb.net
- Database: ssgb_college

### Step 5: Test with MongoDB Compass
1. Download MongoDB Compass
2. Use the same connection string to test connectivity
3. If Compass works, the issue might be Node.js specific

### Step 6: Alternative Connection Methods

#### Option A: Use Standard Connection String
Replace in `.env`:
```
MONGODB_URI=mongodb://sateesh:QFeIYaDqLgcikMPl@cluster0-shard-00-00.b4et8vg.mongodb.net:27017,cluster0-shard-00-01.b4et8vg.mongodb.net:27017,cluster0-shard-00-02.b4et8vg.mongodb.net:27017/ssgb_college?ssl=true&replicaSet=atlas-123abc-shard-0&authSource=admin&retryWrites=true&w=majority
```

#### Option B: Use Different DNS Servers
Add to your Windows DNS settings:
- Primary: 8.8.8.8 (Google DNS)
- Secondary: 8.8.4.4 (Google DNS)

#### Option C: Temporary Local MongoDB
If Atlas continues to fail, install MongoDB locally:
```powershell
# Install MongoDB using Chocolatey
choco install mongodb

# Or download from https://www.mongodb.com/try/download/community
```

Then use local connection:
```
MONGODB_URI=mongodb://localhost:27017/ssgb_college
```

### Step 7: Corporate Network Issues
If you're on a corporate network:
1. Contact IT about MongoDB Atlas access
2. Check if ports 27017-27019 are blocked
3. Verify if SRV record lookups are allowed
4. Consider using a VPN

## Current Application Status

Even without database connection, you can:
- ✅ View the application interface
- ✅ Test frontend navigation
- ✅ See the UI design and layout
- ❌ Cannot login (requires database)
- ❌ Cannot perform CRUD operations

## Next Steps

1. Try the troubleshooting steps above
2. If Atlas works, run: `node scripts/seedAdmin.js`
3. Default admin credentials will be:
   - Email: admin@ssgbcollege.edu
   - Password: Admin@123

## Testing the Application

Once database is connected:
1. Open http://localhost:3000
2. Login with admin credentials
3. Test all modules (Students, Employees, Finance, Library)

## Support

If you continue having issues:
1. Share the output of the network connectivity tests
2. Check MongoDB Atlas cluster status
3. Verify your internet connection and firewall settings
