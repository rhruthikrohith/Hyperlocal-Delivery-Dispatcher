# Setup Guide - Hyperlocal Delivery Dispatcher

Complete step-by-step setup instructions for the Hyperlocal Delivery Dispatcher application.

## System Requirements

- **Node.js**: v16 or higher
- **npm**: v8 or higher
- **MongoDB**: Cloud (Atlas) or Local instance
- **Git**: For version control

## Step 1: MongoDB Setup

### Option A: MongoDB Atlas (Recommended for Development)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster
4. Create a database user with password
5. Whitelist your IP address
6. Get your connection string
7. Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?appName=Cluster0`

### Option B: Local MongoDB

1. Download and install [MongoDB Community Edition](https://docs.mongodb.com/manual/installation/)
2. Start MongoDB service:
   ```bash
   # Windows
   mongod.exe
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```
3. Connection string: `mongodb://localhost:27017/hyperlocal_dispatcher`

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd Hyperlocal_Dispatcher
cd backend
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Configure Environment Variables

Create `.env` file in backend directory (use `.env.example` as template):

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your_secret_key_min_12_chars_very_secure
```

**Important**: 
- Replace `username` and `password` with your MongoDB credentials
- Use a strong JWT_SECRET
- Keep `.env` file private (already in .gitignore)

### 2.4 Verify Backend Setup

Test if backend starts correctly:
```bash
npm run dev
```

Expected output:
```
MongoDB Connected Successfully
Server running on port 5000
Environment: development
```

### 2.5 Test Backend Health

Open browser and go to:
```
http://localhost:5000/
```

Expected response:
```json
{
  "message": "Hyperlocal Dispatcher API Running"
}
```

## Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory

In a new terminal:
```bash
cd Hyperlocal_Dispatcher
cd frontend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Configure Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

**Note**: This should point to your backend API URL

### 3.4 Verify Frontend Setup

Start the development server:
```bash
npm run dev
```

Expected output:
```
VITE v5.4.1  ready in 234 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

### 3.5 Test Frontend

Open browser and go to:
```
http://localhost:3000/
```

You should see the Login page.

## Step 4: Verify Full Setup

### 4.1 Test Registration

1. Click "Don't have an account? Register"
2. Fill in:
   - Name: Test User
   - Email: testuser@example.com
   - Password: password123
   - Role: Customer
3. Click Register button
4. You should see success and be able to login

### 4.2 Test Login

1. Enter credentials from registration
2. Click Login button
3. You should be redirected to Home page
4. You should see "Test User (customer)" in top right

### 4.3 Test Order Creation

1. Fill order form:
   - Customer Name: John Doe
   - Pickup: 123 Main St
   - Delivery: 456 Oak Ave
2. Click "Create Order"
3. Order should appear below the form

### 4.4 Test Order Update

1. Register/login as Admin or Rider
2. Click "Update Status" on an order
3. Select "In Transit" from dropdown
4. Click "Update"
5. Status should change

## Development Workflow

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### Terminal 3: MongoDB (if local)
```bash
mongod
# Starts MongoDB service
```

## File Locations

```
Hyperlocal_Dispatcher/
├── backend/
│   ├── .env                    ← Backend environment variables
│   ├── .env.example            ← Template for .env
│   ├── server.js               ← Main server file
│   ├── package.json
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── frontend/
│   ├── .env                    ← Frontend environment variables
│   ├── .env.example            ← Template for .env
│   ├── vite.config.js
│   ├── package.json
│   ├── src/
│   ├── index.html
│   └── node_modules/
└── README.md
```

## Troubleshooting

### MongoDB Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**:
1. Verify MongoDB is running
2. Check connection string in `.env`
3. For Atlas, ensure:
   - Correct username/password
   - IP whitelist includes your IP (use 0.0.0.0/0 for development only)
   - Network access is enabled

### CORS Error in Browser

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
1. Verify `VITE_API_URL` in frontend `.env`
2. Should be: `http://localhost:5000/api`
3. Check backend CORS configuration in `server.js`
4. Make sure backend is running before frontend makes requests

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

Or change PORT in `.env` to different value (e.g., 5001)

### Dependencies Installation Issues

**Error**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
npm install --legacy-peer-deps
```

### Module Not Found Error

**Error**: `Cannot find module '@vitejs/plugin-react'`

**Solution**:
```bash
cd frontend
npm install
# Or
npm install @vitejs/plugin-react
```

### Token Errors

**Error**: `Invalid token` or `No token provided`

**Solution**:
1. Clear browser localStorage:
   - Open DevTools (F12)
   - Application → LocalStorage → Clear All
2. Logout and login again
3. Verify JWT_SECRET matches frontend and backend

## Performance Optimization

### Frontend Optimization

1. Enable minification for production:
   ```bash
   npm run build
   ```

2. Check bundle size:
   ```bash
   npm run build -- --stats
   ```

### Backend Optimization

1. Add database indexing (in MongoDB):
   ```javascript
   // On email field
   db.users.createIndex({ email: 1 }, { unique: true })
   
   // On status field
   db.orders.createIndex({ status: 1 })
   ```

2. Add caching headers to responses

## Security Checklist

- [ ] Change JWT_SECRET to a strong, unique value
- [ ] Keep .env files out of version control
- [ ] Use HTTPS in production
- [ ] Enable MongoDB authentication
- [ ] Whitelist only necessary IP addresses
- [ ] Use environment variables for sensitive data
- [ ] Validate all user inputs
- [ ] Implement rate limiting for production
- [ ] Add HTTPS/SSL certificate for production
- [ ] Never commit .env files to git

## Next Steps

1. Read [README.md](./README.md) for feature overview
2. Read [TESTING.md](./TESTING.md) for testing guide
3. Review API endpoints in README.md
4. Start developing features!

## Production Deployment

Before deploying to production:

1. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Set production environment variables
3. Use MongoDB Atlas with strong credentials
4. Enable SSL/TLS
5. Set up monitoring and logging
6. Configure CI/CD pipeline

## Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review [TESTING.md](./TESTING.md)
3. Check logs in terminal
4. Use browser DevTools for debugging

---

**Setup Complete!** Your application is ready to use.

Happy coding! 🚀

Last Updated: May 20, 2026
