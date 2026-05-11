# Solo Parent Information System

A full-stack web application for managing Barangay Solo Parent applications built with Node.js, Express, and Preact.

## Features

- **Public Portal**: Information about solo parent programs
- **Online Application**: Complete digital application form
- **Application Tracking**: Track application status online
- **Admin Dashboard**: Analytics and statistics
- **User Management**: Admin and staff account management
- **Reports**: Export to CSV

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Preact (via CDN)
- **Database**: PostgreSQL (Render)
- **Styling**: Tailwind CSS (via CDN)

## Quick Start

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your PostgreSQL connection details

5. Start the server:
   ```bash
   npm start
   ```

6. Open http://localhost:10000

## Deployment on Render

### 1. Create PostgreSQL Database

1. Go to [render.com](https://render.com)
2. Create a new **PostgreSQL** database
3. Note the connection details (host, port, database, username, password)

### 2. Deploy Web Service

1. Create a new **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `/` (leave empty)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or Starter

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<from step 1>
   DB_PORT=5432
   DB_USER=<from step 1>
   DB_PASSWORD=<from step 1>
   DB_NAME=<from step 1>
   DB_SSL=true
   JWT_SECRET=<generate-a-secure-key>
   JWT_EXPIRES_IN=7d
   ```

5. Create internal connection to your PostgreSQL database

6. Deploy

### 3. Database Setup

The database tables will be created automatically on first run. If you need to run manually:

1. Go to your PostgreSQL instance on Render
2. Click on "PSQL Console"
3. Run the SQL commands from `database/schema.sql`

## Default Admin Login

- **Email**: admin@barangay.gov.ph
- **Password**: admin123

**Important**: Change this password immediately after first login!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Applicants
- `POST /api/applicants` - Create application
- `GET /api/applicants` - List applications
- `GET /api/applicants/:id` - Get application details
- `PUT /api/applicants/:id` - Update application
- `DELETE /api/applicants/:id` - Delete application

### Admin
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/applicants/:id/status` - Update status

### Dashboard
- `GET /api/dashboard` - Get statistics

### Reports
- `GET /api/reports/demographics` - Get demographic data
- `GET /api/reports/export/excel` - Export to CSV

## Project Structure

```
solo-parent-system/
├── server.js              # Express server entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── .env.example          # Example environment file
├── render.yaml           # Render deployment config
├── public/
│   └── index.html         # Frontend HTML
├── src/
│   ├── config/
│   │   └── database.js    # PostgreSQL connection
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   ├── applicants.js  # Application routes
│   │   ├── admin.js       # Admin routes
│   │   ├── dashboard.js   # Dashboard routes
│   │   ├── notifications.js # Notification routes
│   │   └── reports.js    # Report routes
│   ├── middleware/
│   │   ├── auth.js       # JWT authentication
│   │   └── upload.js     # File upload
│   ├── pages/
│   │   ├── Home.js       # Public homepage
│   │   ├── Login.js      # Login page
│   │   ├── Register.js   # Register page
│   │   ├── Dashboard.js   # Admin dashboard
│   │   ├── Apply.js      # Application form
│   │   ├── TrackApplication.js # Track status
│   │   └── admin/
│   │       ├── Applicants.js # Manage applicants
│   │       ├── Users.js     # User management
│   │       └── Reports.js   # Reports
│   ├── components/
│   │   ├── App.js        # Main app component
│   │   ├── Layout.js     # Admin layout
│   │   └── toast.js      # Toast notifications
│   ├── context/
│   │   └── AuthContext.js # Auth context
│   └── utils/
│       └── api.js        # API client
└── database/
    └── schema.sql        # PostgreSQL schema
```

## Troubleshooting

### CORS Errors
The server is configured to allow all origins in development. For production, update the CORS configuration in `server.js`.

### Database Connection Issues
1. Check if PostgreSQL is running
2. Verify all environment variables are set correctly
3. Ensure the database exists

### File Upload Issues
The `uploads` directory is created automatically. Ensure the filesystem is writable.

## License

MIT
