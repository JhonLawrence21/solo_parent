# Deployment Guide

## Deploying Solo Parent Information System

### Option 1: Railway PostgreSQL + Render Web Service

#### 1. Railway PostgreSQL Setup
Get these values from your Railway PostgreSQL:
- **Host**: TCP Proxy Domain from Railway
- **Port**: 5432
- **User**: postgres
- **Password**: your Railway password
- **Database**: railway

#### 2. Deploy on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repo: `JhonLawrence21/solo_parent`
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DB_HOST` | (Railway TCP Proxy Domain) |
| `DB_PORT` | `5432` |
| `DB_USER` | `postgres` |
| `DB_PASSWORD` | (Railway password) |
| `DB_NAME` | `railway` |
| `DB_SSL` | `true` |
| `JWT_SECRET` | (any random string 32+ chars) |

6. Click **Create Web Service**

#### 3. Update .env
After getting the values, update your `.env` file:

```
NODE_ENV=production
PORT=10000
DB_HOST=your-railway-tcp-proxy-domain
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-railway-password
DB_NAME=railway
DB_SSL=true
JWT_SECRET=your-secret-key-here
```

### Option 2: Full Deploy on Railway

1. Create new Railway project
2. Add PostgreSQL plugin
3. Add Node.js service with:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Set environment variables
5. Deploy

### Default Admin Login
- **Email**: admin@barangay.gov.ph
- **Password**: admin123

**Important**: Change the password after first login!

### Troubleshooting

**Database Connection Error**
- Verify all DB_* environment variables are correct
- Make sure DB_SSL is set to `true`
- Check if Railway IP whitelist allows Render

**CORS Errors**
- The app is configured to allow all origins in production

**Build Fails**
- Check that package.json is in the root directory
- Verify all dependencies are listed
