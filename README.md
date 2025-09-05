# NATPAC Modular Travel Data Collector

A single-page, frontend-heavy web application for collecting travel data built with Next.js and React. The application features a modular, component-based architecture designed for performance and maintainability.

## Features

- **User Authentication**: Email/password registration and login with JWT tokens
- **Data Collection Consent**: GDPR-compliant consent management
- **Trip Data Collection**: Comprehensive trip information form
- **Travel Timeline**: Visual chronological display of past travels
- **Mobile-First Design**: Fully responsive design optimized for mobile devices
- **MongoDB Integration**: Secure data storage and retrieval

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React.js with JSX
- **Styling**: Tailwind CSS
- **Backend**: Node.js API routes within Next.js
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB
- **Password Hashing**: bcryptjs

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.js    # User registration
│   │   │   ├── login/route.js       # User login
│   │   │   └── consent/route.js     # Consent management
│   │   └── trips/
│   │       └── route.js             # Trip CRUD operations
│   ├── globals.css                  # Global styles
│   ├── layout.js                    # Root layout
│   └── page.js                      # Main application entry point
├── components/
│   ├── Auth.jsx                     # Authentication component
│   ├── ConsentScreen.jsx            # Data collection consent
│   ├── TripForm.jsx                 # Trip data entry form
│   ├── TripTimeline.jsx             # Travel timeline display
│   ├── StatusMessage.jsx            # Status/error messages
│   └── LoadingSpinner.jsx           # Loading indicator
└── lib/
    ├── mongodb.js                   # MongoDB connection utility
    └── jwt.js                       # JWT token utilities
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or remote)
- Modern web browser with JavaScript enabled

## Installation & Setup

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Edit `.env.local` with your actual MongoDB connection string if needed:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB=natpac_travel
   JWT_SECRET=natpac-travel-super-secret-jwt-key-for-development-2024
   JWT_EXPIRES_IN=7d
   ```

3. **Set up MongoDB**:
   - Install MongoDB locally or use MongoDB Atlas
   - The application will automatically create the required collections:
     - `users`: User accounts and consent status
     - `trips`: Trip data with user associations

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed with bcrypt),
  name: String,
  consent: Boolean | null,
  createdAt: Date,
  updatedAt: Date
}
```

### Trips Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to users),
  destination: String,
  startDate: Date,
  endDate: Date,
  purpose: String,
  transportation: String,
  accommodation: String | null,
  companions: String | null,
  activities: String | null,
  notes: String | null,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/consent` - Update consent status

### Trips
- `GET /api/trips` - Fetch user's trips
- `POST /api/trips` - Create new trip

All protected endpoints require `Authorization: Bearer <token>` header.

## Component Architecture

### Core Components

1. **Auth.jsx**: Handles user registration and login with email/password
2. **ConsentScreen.jsx**: GDPR-compliant consent collection interface
3. **TripForm.jsx**: Comprehensive trip data entry with validation
4. **TripTimeline.jsx**: Visual timeline of travel history
5. **StatusMessage.jsx**: Reusable status and error messaging
6. **LoadingSpinner.jsx**: Loading state indicator

### Utility Libraries

1. **mongodb.js**: Database connection and collection management
2. **jwt.js**: Token creation, verification, and validation

## Usage Flow

1. **Authentication**: Users register or log in with email/password
2. **Consent**: First-time users must provide data collection consent
3. **Data Entry**: Consented users can add trip information via the form
4. **Timeline View**: Users can view their travel history in chronological order
5. **Navigation**: Toggle between trip entry and timeline views

## Security Features

- Password hashing with bcryptjs (12 salt rounds)
- JWT token-based authentication with expiration
- Protected API routes with token verification
- Input validation and sanitization
- Secure MongoDB queries with ObjectId validation

## Mobile Responsiveness

The application is built with a mobile-first approach using Tailwind CSS:
- Responsive grid layouts
- Touch-friendly interface elements
- Optimized form inputs for mobile keyboards
- Accessible navigation and interactions

## Future Enhancements

- Google OAuth integration (UI already prepared)
- Trip photo uploads
- Data export functionality
- Advanced trip analytics
- Trip sharing capabilities

## Development

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGODB_DB` | Database name | `natpac_travel` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for NATPAC travel data collection research purposes.
