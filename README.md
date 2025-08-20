# BeeMentor by QueenB - Mentor-Mentee Matching Platform
A full-stack web application for connecting mentors and mentees in the tech industry.

Built with Node.js, Express, React, Material UI, and MongoDB.

## 🎯 Project Overview

QueenB is a platform that connects experienced tech professionals (mentors) with aspiring developers (mentees). The platform allows mentees to search for mentors based on technologies, experience level, and other criteria, and provides secure communication channels.

### Key Features:
- **Mentor Discovery**: Search and filter mentors by technology, experience, and name
- **Secure Authentication**: JWT-based authentication with fallback to basic auth for development
- **Profile Management**: Comprehensive mentor and mentee profiles
- **Contact Integration**: Direct contact via email, phone, WhatsApp, and LinkedIn
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Features

- **Modern UI**: Beautiful, responsive interface built with Material UI
- **RESTful API**: Well-structured backend API with Express.js
- **Database Integration**: MongoDB Atlas support with fallback to local data
- **Enhanced Security**: JWT authentication, rate limiting, and security headers
- **Error Handling**: Comprehensive error handling and logging
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration
- **Nodemon** - Development auto-restart

### Frontend
- **React 18** - UI library
- **Material UI (MUI)** - Component library
- **React Router** - Client-side routing
- **React Scripts** - Build tools

### Database
- **MongoDB Atlas** - Cloud database (recommended)
- **Local MongoDB** - Development fallback

## 📦 Project Structure

```
QueenB-template-2025/
├── server/                    # Backend application
│   ├── config/               # Configuration files
│   │   └── database.js       # MongoDB connection setup
│   ├── middleware/           # Express middleware
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/              # Mongoose data models
│   │   ├── Mentor.js        # Mentor schema and methods
│   │   └── Mentee.js        # Mentee schema and methods
│   ├── routes/              # API route handlers
│   │   ├── authRoutes.js    # Authentication endpoints
│   │   ├── mentorRoutes.js  # Mentor CRUD operations
│   │   └── menteeRoutes.js  # Mentee CRUD operations
│   ├── services/            # Business logic layer
│   │   └── usersService.js  # User-related services
│   ├── data/               # Mock data files
│   ├── utils/              # Utility functions
│   ├── index.js            # Server entry point
│   ├── seed.js             # Database seeding script
│   ├── env.example         # Environment variables template
│   └── package.json        # Server dependencies
├── client/                 # Frontend application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── mentor/     # Mentor-specific components
│   │   │   └── ...         # Other UI components
│   │   ├── services/       # API services
│   │   │   └── authService.js # Authentication service
│   │   ├── utils/          # Utility functions
│   │   ├── contexts/       # React contexts
│   │   ├── hook/           # Custom React hooks
│   │   ├── App.js          # Main application component
│   │   └── index.js        # React entry point
│   └── package.json        # Client dependencies
├── package.json            # Root package.json with scripts
├── api-documentation.md    # API endpoints documentation
├── AUTH_API_DOCUMENTATION.md # Authentication API docs
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- MongoDB Atlas account (recommended) or local MongoDB installation

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QueenB-template-2025
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server and client dependencies
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp env.example .env
   # Edit .env file with your configuration
   cd ..
   ```

4. **Generate JWT Secret**
   ```bash
   # Generate a secure JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   # Copy the output and paste it as JWT_SECRET in your .env file
   ```

5. **Set up MongoDB Atlas (Recommended)**
   
   **Step 1: Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (M0 Free tier recommended)
   
   **Step 2: Configure Database Access**
   - Go to Database Access in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"
   
   **Step 3: Configure Network Access**
   - Go to Network Access in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
   
   **Step 4: Get Connection String**
   - Go to Clusters in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   
   **Step 5: Update Environment Variables**
   - Edit `server/.env` file
   - Replace `your_username`, `your_password`, and `your_cluster` in MONGODB_URI
   - Example: `mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/queenb_db?retryWrites=true&w=majority`

### Running the Application

#### Development Mode (Recommended)

**Option 1: Run both client and server concurrently**
```bash
npm run dev
```

**Option 2: Run separately**

Start the backend server:
```bash
npm run server
```

Start the frontend client (in a new terminal):
```bash
npm run client
```

This will start:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:3000

#### Database Seeding (Optional)
```bash
cd server
npm run seed
```

This will populate the database with sample mentors and mentees for testing.

#### Health Check
- `GET /api/health` - Server health check
- `GET /api` - API information and endpoints

### Building for Production

1. **Build the React client:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```


## 🔧 Development

### Available Scripts

- `npm run dev` - Run both client and server in development mode
- `npm run server` - Run only the backend server
- `npm run client` - Run only the frontend client
- `npm run install-all` - Install dependencies for both client and server
- `npm run build` - Build the React client for production
- `npm start` - Start the production server

### Authentication System

The application supports two authentication methods:

1. **JWT Authentication** (Primary)
   - Secure token-based authentication
   - Tokens expire after 24 hours
   - Stored in localStorage

2. **Basic Authentication** (Development Fallback)
   - Simple email/password comparison
   - Used when JWT authentication fails
   - For development and testing purposes

### Test Users

After running the seed script, you can use these test accounts:

**Mentors (password: `password123`):**
- sarah.cohen@example.com
- dana.levy@example.com
- rachel.bendavid@example.com

**Mentees (password: `password123`):**
- noa.katz@example.com
- or.solomon@example.com
- maya.friedman@example.com

### Key Features

- **Responsive Design**: Works on all device sizes
- **Modern UI**: Material UI components provide a professional look
- **Error Handling**: Comprehensive error handling on both frontend and backend
- **Loading States**: User-friendly loading indicators
- **Form Validation**: Client and server-side validation
- **Search Functionality**: Filter mentors by technology, name, and experience
- **Contact Integration**: Direct contact via email, phone, WhatsApp, and LinkedIn


## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Missing JWT_SECRET error**
   ```bash
   # Generate a new JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   # Add it to your .env file
   ```

2. **Port already in use**
   - Change server port in `server/.env`: `PORT=5001`
   - Update client proxy in `client/package.json`: `"proxy": "http://localhost:5001"`

3. **MongoDB connection issues**
   - Check your `MONGODB_URI` in `.env`
   - Ensure network access is configured in MongoDB Atlas
   - Try local MongoDB: `MONGODB_URI=mongodb://localhost:27017/queenb_db`

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

### Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check the server console for backend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible

---

Built with ❤️ using React, Material UI, Node.js, and MongoDB
