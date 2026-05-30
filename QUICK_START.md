# Quick Reference Guide

## 📋 Quick Start

### 1. Setup Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI
npm run dev
```

### 2. Setup Frontend  
```bash
cd frontend
npm install
# .env already configured
npm run dev
```

### 3. Open in Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@test.com | password123 |
| Vendor | vendor@test.com | password123 |
| Rider | rider@test.com | password123 |
| Admin | admin@test.com | password123 |

*Note: You can register new accounts with any email*

## 📁 Project Structure

```
Hyperlocal_Dispatcher/
├── backend/
│   ├── middleware/authMiddleware.js
│   ├── controllers/authController.js
│   ├── controllers/orderController.js
│   ├── models/UserModel.js
│   ├── models/OrderModel.js
│   ├── routes/authRoutes.js
│   ├── routes/orderRoutes.js
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/Login.jsx
│   │   ├── pages/Register.jsx
│   │   ├── pages/Home.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── index.html
│   ├── .env
│   ├── .env.example
│   └── package.json
├── README.md
├── SETUP.md
├── TESTING.md
├── FEATURES.md
├── CHANGELOG.md
└── .gitignore
```

## 🌐 API Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | /api/auth/register | No | All |
| POST | /api/auth/login | No | All |
| GET | /api/orders | No | All |
| GET | /api/orders/:id | No | All |
| POST | /api/orders/create | Yes | Customer, Vendor, Admin |
| PUT | /api/orders/:id | Yes | Admin, Rider |
| DELETE | /api/orders/:id | Yes | Customer, Admin |
| GET | /api/orders/customer/my-orders | Yes | Customer |
| GET | /api/orders/rider/my-orders | Yes | Rider |

## ✨ Key Features

### Authentication
- ✅ User registration
- ✅ Secure login
- ✅ JWT tokens (24h expiry)
- ✅ Password hashing

### Orders
- ✅ Create orders
- ✅ View all orders
- ✅ Update status (6 states)
- ✅ Delete orders
- ✅ Filter by user

### Roles
- ✅ Customer
- ✅ Vendor
- ✅ Rider
- ✅ Admin

### Validation
- ✅ Email validation
- ✅ Password requirements
- ✅ Required fields
- ✅ Enum validation

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your_secret_key_here
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

See **TESTING.md** for:
- 50+ test cases
- Test scenarios for each feature
- API testing examples
- Bug report template

## 📚 Documentation

- **README.md** - Project overview
- **SETUP.md** - Installation guide
- **TESTING.md** - Testing guide
- **FEATURES.md** - Feature details
- **CHANGELOG.md** - Change history

## 🚀 Common Tasks

### Register New User
1. Click "Register" link
2. Fill in name, email, password, role
3. Click Register button

### Create Order
1. Login as Customer or Vendor
2. Fill order form
3. Click "Create Order"

### Update Order Status
1. Login as Admin or Rider
2. Click "Update Status" on order
3. Select new status
4. Click "Update"

### Delete Order
1. Login as Customer or Admin
2. Click "Delete" button on order

### View Your Orders
1. Login as Customer or Rider
2. All orders filtered automatically

## 🐛 Troubleshooting

### MongoDB Error
- Check .env MONGO_URI
- Verify credentials
- Whitelist IP in Atlas

### CORS Error
- Check VITE_API_URL in frontend .env
- Verify backend is running

### Port in Use
- Change PORT in backend .env
- Or kill process using port

### Token Error
- Clear browser localStorage
- Logout and login again

## 📊 Database

### MongoDB Collections
- **users** - Stores user accounts
- **orders** - Stores order data

### Indexes
- users.email (unique)
- orders.status

## 🔒 Security Features

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Input validation
- ✅ CORS protection
- ✅ Environment variables

## 📈 Performance

- Fast API responses
- Minimal database queries
- Efficient state management
- Optimized bundle size

## 🎯 Next Steps

1. Read **SETUP.md** for detailed setup
2. Follow **TESTING.md** to verify features
3. Review **FEATURES.md** for details
4. Check **README.md** for overview

## 💡 Tips

- Use different terminals for backend and frontend
- Keep MongoDB running in background
- Use browser DevTools for debugging
- Check server logs for errors
- Clear cache if UI issues occur

## 📞 Support Resources

1. Check SETUP.md troubleshooting section
2. Review TESTING.md for common issues
3. Check server console for errors
4. Use browser DevTools network tab
5. Review component source code

---

**Everything is ready to use!** 🎉

Start with `npm run dev` in both backend and frontend directories.

Last Updated: May 20, 2026
