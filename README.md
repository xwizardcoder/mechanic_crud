# Mechanic Booking System — CRUD Application

A full-stack **MERN** (MongoDB · Express · React · Node.js) digital management system for mechanic shop floor staff.

## Features
- ✅ Full CRUD: Create, Read, Update, Delete service job bookings
- ✅ Search & filter by status, service type, priority
- ✅ Real-time form validation with XSS sanitization
- ✅ Loading indicators for all async operations
- ✅ Empty state UI when no records found
- ✅ Confirm modal before delete
- ✅ Analytics telemetry simulation
- ✅ 100% ARIA accessible

## Tech Stack
- **Frontend**: React 18 + Vite + React Router DOM
- **Backend**: Node.js + Express 4
- **Database**: MongoDB Atlas + Mongoose
- **Deploy**: Vercel

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/xwizardcoder/mechanic_crud.git
cd mechanic_crud
```

### 2. Server setup
```bash
cd server
npm install
cp ../.env.example .env
# Edit .env and add your MONGODB_URI
npm run dev
```

### 3. Client setup
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`

## Vercel Deployment

1. Push to GitHub
2. Import repo in Vercel dashboard
3. Add environment variable: `MONGODB_URI` = your MongoDB Atlas connection string
4. Deploy ✅

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | List all bookings |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:id` | Get single booking |
| PUT | `/api/bookings/:id` | Update booking |
| DELETE | `/api/bookings/:id` | Delete booking |
| GET | `/api/bookings/stats` | Get dashboard stats |
