# Testing Guide - Hyperlocal Delivery Dispatcher

This guide will help you test all features of the application to ensure everything works perfectly.

## Prerequisites

1. MongoDB cluster is running and accessible
2. Backend server is running on port 5000
3. Frontend dev server is running on port 3000
4. Environment variables are configured properly

## Test Users

For testing, you can create the following test accounts:

### Customer
- Email: customer@test.com
- Password: password123
- Role: Customer

### Vendor
- Email: vendor@test.com
- Password: password123
- Role: Vendor

### Rider
- Email: rider@test.com
- Password: password123
- Role: Rider

### Admin
- Email: admin@test.com
- Password: password123
- Role: Admin

## Test Scenarios

### 1. Authentication Testing

#### 1.1 Registration
- [ ] Go to Register page (click "Don't have an account? Register")
- [ ] Fill in name, email, password, and select role
- [ ] Click Register button
- [ ] Verify success message appears
- [ ] Switch back to Login page
- [ ] Login with newly created account
- [ ] Verify user is logged in and redirected to Home page

#### 1.2 Email Validation
- [ ] Try registering with invalid email (e.g., "test@")
- [ ] Verify error message appears
- [ ] Try registering with password less than 6 characters
- [ ] Verify error message "Password must be at least 6 characters"
- [ ] Try registering with same email twice
- [ ] Verify error message "Email already registered"

#### 1.3 Login
- [ ] Enter valid credentials
- [ ] Verify successful login and redirect to Home
- [ ] Check user name and role display in top right
- [ ] Enter invalid email
- [ ] Verify error message "Invalid credentials"
- [ ] Enter wrong password
- [ ] Verify error message "Invalid credentials"

#### 1.4 Logout
- [ ] Click Logout button
- [ ] Verify redirected to Login page
- [ ] Verify all user data is cleared

### 2. Order Management Testing

#### 2.1 Create Order (As Customer/Vendor)
- [ ] Login as Customer or Vendor
- [ ] Verify "Create Order" form is visible
- [ ] Fill all order fields:
  - Customer Name: "John Doe"
  - Pickup Address: "123 Main St"
  - Delivery Address: "456 Oak Ave"
- [ ] Click "Create Order" button
- [ ] Verify order appears in list below
- [ ] Verify form is cleared
- [ ] Check that order shows correct status "Pending"

#### 2.2 Order Validation
- [ ] Try creating order with empty fields
- [ ] Verify error message "Please fill all fields"
- [ ] Fill only customer name, leave addresses empty
- [ ] Verify error message appears
- [ ] Try leaving any field empty
- [ ] Verify error validation works

#### 2.3 View Orders
- [ ] Login as any user
- [ ] Verify orders list is displayed
- [ ] Verify each order shows:
  - Customer name
  - Pickup address
  - Delivery address
  - Current status
  - Created date/time
- [ ] Create multiple orders
- [ ] Verify all orders are displayed

#### 2.4 Update Order Status (As Admin/Rider)
- [ ] Login as Admin or Rider
- [ ] Verify "Update Status" button appears on each order
- [ ] Click "Update Status" button on any order
- [ ] Verify dropdown appears with status options:
  - Pending
  - Assigned
  - Picked Up
  - In Transit
  - Delivered
  - Cancelled
- [ ] Select "In Transit"
- [ ] Click "Update" button
- [ ] Verify status changes to "In Transit"
- [ ] Verify button returns to "Update Status"
- [ ] Click "Update Status" again and select "Delivered"
- [ ] Verify status updates correctly
- [ ] Test "Cancel" button during status update

#### 2.5 Update Status (Not Available for Customer)
- [ ] Login as Customer
- [ ] Verify "Update Status" button does NOT appear
- [ ] Verify only Delete button is visible

#### 2.6 Delete Order
- [ ] Login as Customer or Admin
- [ ] Click "Delete" button on any order
- [ ] Verify order is removed from list
- [ ] Try refreshing page
- [ ] Verify order is still deleted (persisted in database)

#### 2.7 Delete Authorization
- [ ] Login as Rider
- [ ] Verify "Delete" button is NOT visible
- [ ] Only "Update Status" should be available
- [ ] Login as Customer with different order
- [ ] Verify "Delete" button is visible

### 3. Role-Based Access Control Testing

#### 3.1 Customer
- [ ] Can create orders ✓
- [ ] Can view all orders ✓
- [ ] Can delete own orders ✓
- [ ] Cannot update order status ✓
- [ ] Cannot delete others' orders ✓

#### 3.2 Vendor
- [ ] Can create orders ✓
- [ ] Can view all orders ✓
- [ ] Can delete orders ✓
- [ ] Cannot update order status ✓

#### 3.3 Rider
- [ ] Can view all orders ✓
- [ ] Can update order status ✓
- [ ] Cannot create orders ✓
- [ ] Cannot delete orders ✓

#### 3.4 Admin
- [ ] Can create orders ✓
- [ ] Can view all orders ✓
- [ ] Can update order status ✓
- [ ] Can delete orders ✓

### 4. Error Handling Testing

#### 4.1 Network Errors
- [ ] Stop backend server
- [ ] Try to login
- [ ] Verify error message appears
- [ ] Restart backend server
- [ ] Try login again
- [ ] Verify login works

#### 4.2 Invalid Data
- [ ] Try submitting empty form
- [ ] Verify proper error messages
- [ ] Try invalid email format
- [ ] Verify error handling

#### 4.3 Error Display
- [ ] All errors should display in red box
- [ ] Error messages should be user-friendly
- [ ] Errors should clear after successful operation

### 5. UI/UX Testing

#### 5.1 Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify all elements are readable
- [ ] Verify buttons are clickable on mobile

#### 5.2 Visual Elements
- [ ] Check color scheme is consistent
- [ ] Verify all text is readable
- [ ] Check button hover states
- [ ] Verify proper spacing between elements
- [ ] Check form layout

#### 5.3 Loading States
- [ ] Verify loading indicator appears during API calls
- [ ] Verify buttons are disabled during submission
- [ ] Verify form clears after successful submission

### 6. API Testing (Optional - Using Postman/curl)

#### 6.1 Registration Endpoint
```
POST /api/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "customer"
}
Expected: 201 with user data
```

#### 6.2 Login Endpoint
```
POST /api/auth/login
Body: {
  "email": "test@example.com",
  "password": "password123"
}
Expected: 200 with token and user data
```

#### 6.3 Create Order (Protected)
```
POST /api/orders/create
Header: Authorization: Bearer <token>
Body: {
  "customerName": "John Doe",
  "pickupAddress": "123 Main St",
  "deliveryAddress": "456 Oak Ave"
}
Expected: 201 with order data
```

#### 6.4 Get Orders
```
GET /api/orders
Expected: 200 with array of orders
```

#### 6.5 Update Order Status (Protected)
```
PUT /api/orders/<orderId>
Header: Authorization: Bearer <token>
Body: {
  "status": "Delivered"
}
Expected: 200 with updated order
```

#### 6.6 Delete Order (Protected)
```
DELETE /api/orders/<orderId>
Header: Authorization: Bearer <token>
Expected: 200 with success message
```

## Test Checklist

### Backend Functionality
- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] All endpoints respond correctly
- [ ] Authentication works
- [ ] Error handling works
- [ ] CORS is configured

### Frontend Functionality
- [ ] Dev server starts
- [ ] All pages load
- [ ] Authentication context works
- [ ] API calls use correct URL
- [ ] Error messages display
- [ ] Loading states work

### Features
- [ ] Registration works
- [ ] Login works
- [ ] Create order works
- [ ] View orders works
- [ ] Update status works
- [ ] Delete order works
- [ ] Role-based access works
- [ ] Logout works

### Security
- [ ] Passwords are hashed
- [ ] Tokens are required for protected endpoints
- [ ] Invalid tokens are rejected
- [ ] Email validation works
- [ ] Duplicate emails rejected

## Bug Report Template

If you find any issues, use this template:

**Bug Title**: [Brief description]
**Steps to Reproduce**: 
1. 
2. 
3. 

**Expected Behavior**: 

**Actual Behavior**: 

**Screenshots**: [If applicable]

---

**All tests should pass with 100% success rate for production readiness.**

Last Updated: May 20, 2026
