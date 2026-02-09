# Continuous Integration and Delivery Project  
# Local Events


A full-stack web application for discovering and managing local events (concerts, exhibitions, theater) in your city.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Bootstrap 5
- **Backend**: Spring Boot (Java 17) + PostgreSQL
- **Authentication**: HTTP Basic Auth with Spring Security

## Features

- ✅ User registration and login
- ✅ Blog-style event listing with filtering by category
- ✅ Users can mark events as "Interested" or "Going"
- ✅ Real-time participation counters
- ✅ Admin panel for creating/deleting events
- ✅ Image upload for events (admin only)
- ✅ Responsive design with Bootstrap

## Prerequisites

- Java 17+
- Maven
- Node.js 18+
- PostgreSQL 12+

## Setup Instructions



###  Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. **Register/Login**: 
   - New users can register on the login page
   - Admin login: `admin` / `admin`
   - Regular users can register new accounts

2. **View Events**: 
   - Browse events on the home page
   - Filter by category (Concert, Exhibition, Theater)

3. **Participate**: 
   - Logged-in users can mark events as "Interested" or "Going"
   - See real-time counts for each event

4. **Admin Functions**:
   - Click "Add Event" button to create new events
   - Upload event images (optional)
   - Update events
   - Delete events

## API Endpoints

### Public
- `GET /events` - List all events
- `GET /events/{id}` - Get event details
- `POST /api/auth/register` - Register new user

### User (requires USER role)
- `POST /events/{id}/participation` - Mark participation

### Admin (requires ADMIN role)
- `POST /events` - Create event
- `PUT /events/{id}` - Update event
- `DELETE /events/{id}` - Delete event
- `POST /api/upload/image` - Upload event image

