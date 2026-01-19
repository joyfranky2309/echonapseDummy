# JWT Authentication with Refresh Tokens - Guide

## Overview
This project now implements JWT (JSON Web Token) authentication with refresh tokens. This allows secure user authentication and keeps users signed in using long-lived refresh tokens while short-lived access tokens protect against token theft.

## Key Concepts

### Access Token
- **Purpose**: Authenticates API requests
- **Lifespan**: 15 minutes
- **Storage**: Sent with every request in the `Authorization` header
- **Security**: Short lifespan means compromised tokens are only valid briefly

### Refresh Token
- **Purpose**: Obtains new access tokens when they expire
- **Lifespan**: 7 days
- **Storage**: Stored in the database and client-side (secure storage recommended)
- **Security**: Only used to generate new access tokens, not for API requests directly

## Authentication Flow

### 1. Registration Flow
```
User submits: fullName, phno, email, password, condition
                    ↓
           Password hashed with bcrypt
                    ↓
         User stored in database
                    ↓
        Generate Access Token (15 min)
        Generate Refresh Token (7 days)
                    ↓
      Return tokens to client to store
```

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "fullName": "John Doe",
  "phno": "9876543210",
  "email": "john@example.com",
  "password": "securePassword123",
  "condition": "Depression",
  "caretakerDetails": []
}
```

**Response**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phno": "9876543210"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login Flow
```
User submits: email, password
                    ↓
         Find user by email
                    ↓
      Compare password with stored hash
                    ↓
        Generate new Access Token
        Generate new Refresh Token
                    ↓
   Save refreshToken in database
                    ↓
      Return tokens to client
```

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phno": "9876543210"
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### 3. Making Protected API Requests
```
Client includes in header:
Authorization: Bearer <accessToken>
                    ↓
        Middleware verifies token
                    ↓
      If valid: Proceed with request
      If expired: Return 401 (need new token)
      If invalid: Return 401 (unauthorized)
```

**Example Request**:
```javascript
const response = await fetch('/api/users', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

### 4. Refreshing Access Token
```
Access token expires (401 response)
                    ↓
      Client sends refreshToken
                    ↓
   Server verifies refreshToken
                    ↓
   Check if token exists in database
                    ↓
    Generate new Access Token
                    ↓
   Return new token to client
```

**Endpoint**: `POST /api/auth/refresh-token`

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
```json
{
  "message": "Access token refreshed successfully",
  "accessToken": "new_access_token_here"
}
```

### 5. Logout Flow
```
User clicks logout
                    ↓
   Client sends userId
                    ↓
 Remove refreshToken from database
                    ↓
   Client deletes tokens locally
                    ↓
     User is logged out
```

**Endpoint**: `POST /api/auth/logout`

**Request Body**:
```json
{
  "userId": "user_id"
}
```

## How to Keep Users Signed In

### Client-Side Implementation (React)

1. **Store tokens in localStorage or sessionStorage**:
```javascript
// After login/register
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);
localStorage.setItem('userId', response.user.id);
```

2. **Create an API wrapper with automatic token refresh**:
```javascript
// utils/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const apiCall = async (endpoint, options = {}) => {
  let accessToken = localStorage.getItem('accessToken');

  // Make request with current access token
  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  // If token expired (401), refresh it
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      accessToken = data.accessToken;
      localStorage.setItem('accessToken', accessToken);

      // Retry original request with new token
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Refresh failed, user needs to login again
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      // Redirect to login page
      window.location.href = '/login';
    }
  }

  return response;
};
```

3. **Check if user is logged in on app load**:
```javascript
// App.js
useEffect(() => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken && !accessToken) {
    // Try to refresh token on app load
    refreshAccessToken();
  } else if (accessToken) {
    // User is still logged in
    setIsLoggedIn(true);
  }
}, []);
```

4. **Logout functionality**:
```javascript
const handleLogout = async () => {
  const userId = localStorage.getItem('userId');
  
  await apiCall('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ userId })
  });

  // Clear local storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  
  // Redirect to login
  window.location.href = '/login';
};
```

## Security Best Practices

1. **Environment Variables**: Change the JWT secrets in production
   ```
   JWT_SECRET=your_strong_secret_key
   JWT_REFRESH_SECRET=your_strong_refresh_secret_key
   ```

2. **HTTPS Only**: Always use HTTPS in production

3. **HttpOnly Cookies (Alternative)**: For better security, store refresh tokens in HttpOnly cookies instead of localStorage

4. **Token Rotation**: Consider rotating refresh tokens on each use

5. **Password Requirements**: Enforce strong passwords (minimum 6 characters, can be enhanced)

6. **Rate Limiting**: Add rate limiting to login and register endpoints to prevent brute force attacks

## Files Created/Modified

- **New**: `/middleware/authMiddleware.js` - Token generation and verification
- **New**: `/routes/userRoutes/authRoutes.js` - Auth endpoints (register, login, refresh, logout)
- **Modified**: `/schemas/userSchema.js` - Added password and refreshToken fields
- **Modified**: `/app.js` - Integrated auth middleware and routes

## Testing the Endpoints

### 1. Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phno": "9876543210",
    "email": "john@example.com",
    "password": "secure123",
    "condition": "Depression"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123"
  }'
```

### 3. Make Protected Request
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <accessToken>"
```

### 4. Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refreshToken>"
  }'
```

### 5. Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<userId>"
  }'
```

## Summary

This JWT authentication system provides:
- ✅ Secure password hashing with bcryptjs
- ✅ Short-lived access tokens (15 min) for API security
- ✅ Long-lived refresh tokens (7 days) for session persistence
- ✅ Automatic token refresh flow
- ✅ Protected API endpoints
- ✅ Clean logout mechanism
- ✅ Keeps users signed in even after refresh/restart (via refresh token)
