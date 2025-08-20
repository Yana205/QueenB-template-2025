# QueenB Setup Guide

## 🚀 Quick Start

This guide will help you set up and run the QueenB mentor-mentee matching platform.

## Prerequisites

- **Node.js** (version 14 or higher)
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (recommended) or local MongoDB installation

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd QueenB-template-2025

# Install all dependencies
npm run install-all
```

### 2. Environment Configuration

```bash
# Navigate to server directory
cd server

# Copy environment template
cp env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor
```

### 3. Generate JWT Secret

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as the `JWT_SECRET` value in your `.env` file.

### 4. Database Setup

#### Option A: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (M0 Free tier recommended)

2. **Configure Database Access**
   - Go to Database Access in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"

3. **Configure Network Access**
   - Go to Network Access in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)

4. **Get Connection String**
   - Go to Clusters in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

5. **Update Environment Variables**
   - Edit `server/.env` file
   - Replace `your_username`, `your_password`, and `your_cluster` in MONGODB_URI
   - Example: `mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/queenb_db?retryWrites=true&w=majority`

#### Option B: Local MongoDB

```bash
# Install MongoDB locally (if not already installed)
# Then update MONGODB_URI in .env:
MONGODB_URI=mongodb://localhost:27017/queenb_db
```

### 5. Run the Application

#### Development Mode

```bash
# From the root directory
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:3000

#### Database Seeding (Optional)

```bash
cd server
npm run seed
```

This populates the database with sample mentors and mentees for testing.

### 6. Test the Application

1. **Open your browser** and go to http://localhost:3000
2. **Test authentication** using the sample accounts:

**Mentors (password: `password123`):**
- sarah.cohen@example.com
- dana.levy@example.com
- rachel.bendavid@example.com

**Mentees (password: `password123`):**
- noa.katz@example.com
- or.solomon@example.com
- maya.friedman@example.com

## 🔧 Configuration Details

### Environment Variables

Your `.env` file should contain:

```env
# Required
JWT_SECRET=your-generated-jwt-secret-here

# Database (choose one)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/queenb_db?retryWrites=true&w=majority
# OR for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/queenb_db

# Optional
PORT=5000
NODE_ENV=development
```

### Port Configuration

- **Backend**: Runs on port 5000 by default
- **Frontend**: Runs on port 3000 by default
- **Proxy**: Client proxies API requests to backend

If you need to change ports:
1. Update `PORT` in `server/.env`
2. Update `proxy` in `client/package.json`

## 🐛 Troubleshooting

### Common Issues

1. **"Missing JWT_SECRET" error**
   ```bash
   # Generate a new JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   # Add it to your .env file
   ```

2. **MongoDB connection issues**
   - Check your `MONGODB_URI` in `.env`
   - Ensure network access is configured in MongoDB Atlas
   - Try local MongoDB as fallback

3. **Port conflicts**
   - Change server port in `server/.env`: `PORT=5001`
   - Update client proxy in `client/package.json`: `"proxy": "http://localhost:5001"`

4. **Authentication issues**
   - Clear localStorage: `localStorage.clear()`
   - Check browser console for error messages
   - Verify JWT_SECRET is set correctly

5. **Installation issues**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   rm -rf server/node_modules server/package-lock.json
   rm -rf client/node_modules client/package-lock.json
   npm run install-all
   ```

### Getting Help

1. Check the browser console for frontend errors
2. Check the server console for backend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible

## 📚 Additional Resources

- [API Documentation](./api-documentation.md)
- [Authentication API Documentation](./AUTH_API_DOCUMENTATION.md)
- [README](./README.md)

## 🎯 Next Steps

After successful setup:

1. **Explore the application** - Test all features
2. **Review the codebase** - Understand the architecture
3. **Customize the application** - Add your own features
4. **Deploy to production** - Set up hosting and production database

---

Happy coding! 🚀
