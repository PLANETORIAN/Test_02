# MongoDB Setup Guide

For the NATPAC Travel Data Collector to work properly, you need a MongoDB database. Here are your options:

## Option 1: MongoDB Atlas (Cloud - Recommended for production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string and update `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/natpac_travel?retryWrites=true&w=majority
   ```

## Option 2: Local MongoDB Installation

### Windows
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install MongoDB following the installer prompts
3. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
4. The default connection string should work:
   ```
   MONGODB_URI=mongodb://localhost:27017
   ```

### macOS (with Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

## Option 3: Docker (Quick Setup)

```bash
docker run --name mongodb -d -p 27017:27017 mongo:latest
```

## Verify Connection

After setting up MongoDB, restart your Next.js development server:
```bash
npm run dev
```

The application will automatically create the required collections (`users` and `trips`) when you first use the app.

## Collections Created Automatically

- **users**: Stores user accounts, passwords (hashed), and consent status
- **trips**: Stores trip data linked to user accounts

## Troubleshooting

- Ensure MongoDB is running on the specified port (default: 27017)
- Check that your connection string in `.env.local` is correct
- Verify network connectivity if using MongoDB Atlas
- Check MongoDB logs for any connection issues
