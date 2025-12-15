# Hotel Management System

A full-stack Hotel Management System built with React frontend and Node.js + Express + MongoDB backend.

## Features

### User Roles
- **Admin**: Manage managers, view all data, revenue reports
- **Manager**: Manage rooms, handle bookings, update booking status
- **User**: View rooms, book rooms, manage bookings

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React 19
- React Router DOM
- Axios for API calls
- React Toastify for notifications
- Lucide React for icons
- Vite for build tool

## Installation

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-management
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user

### Admin Routes
- POST `/api/admin/managers` - Create manager
- GET `/api/admin/managers` - Get all managers
- GET `/api/admin/users` - Get all users
- GET `/api/admin/rooms` - Get all rooms
- GET `/api/admin/bookings` - Get all bookings
- GET `/api/admin/revenue` - Get revenue stats

### Manager Routes
- POST `/api/manager/rooms` - Add room
- PUT `/api/manager/rooms/:id` - Update room
- GET `/api/manager/rooms` - Get manager's rooms
- GET `/api/manager/bookings` - Get manager's bookings
- PUT `/api/manager/bookings/:id` - Update booking status

### User Routes
- GET `/api/user/rooms` - Get available rooms
- POST `/api/user/bookings` - Book room
- GET `/api/user/bookings` - Get user's bookings
- PUT `/api/user/bookings/:id/cancel` - Cancel booking

## Database Schema

### User
- name, email, password, role, timestamps

### Room
- roomNumber, type, price, availability, managedBy

### Booking
- userId, roomId, checkInDate, checkOutDate, bookingStatus, totalAmount

## Default Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. Start MongoDB service
2. Run backend server
3. Run frontend development server
4. Register as user/manager or create admin account
5. Login and access role-specific dashboard