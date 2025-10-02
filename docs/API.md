# Gaza Platform - API Documentation

## Base URL
```
Development: http://localhost:3001
Production: https://api.gaza-platform.org
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "role": "USER"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### POST /api/auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "role": "USER"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response (200):**
```json
{
  "accessToken": "new_jwt_token"
}
```

#### POST /api/auth/logout
Invalidate refresh token.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### Users

#### GET /api/users/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "cuid",
  "email": "user@example.com",
  "role": "USER",
  "emailVerified": true,
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "verificationStatus": "VERIFIED"
  }
}
```

#### PUT /api/users/me
Update current user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "city": "City",
  "country": "Country",
  "postalCode": "12345"
}
```

**Response (200):**
```json
{
  "profile": {
    "id": "cuid",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "verificationStatus": "PENDING"
  }
}
```

#### POST /api/users/me/verify
Submit verification documents.

**Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`

**Request Body (Form Data):**
- `documentType`: string (e.g., "passport", "id_card")
- `document`: file

**Response (201):**
```json
{
  "verificationRequest": {
    "id": "cuid",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Donations

#### POST /api/donations
Create a new donation.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 100.00,
  "currency": "USD",
  "campaignId": "campaign_cuid",
  "message": "Keep up the great work!",
  "anonymous": false,
  "paymentProvider": "stripe",
  "paymentIntent": "pi_xxxxx"
}
```

**Response (201):**
```json
{
  "donation": {
    "id": "cuid",
    "amount": 100.00,
    "currency": "USD",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/donations
Get user's donation history.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: string (optional: "PENDING", "COMPLETED", "FAILED")

**Response (200):**
```json
{
  "donations": [
    {
      "id": "cuid",
      "amount": 100.00,
      "currency": "USD",
      "status": "COMPLETED",
      "campaign": {
        "id": "cuid",
        "title": "Campaign Title"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### GET /api/donations/:id
Get specific donation details.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "donation": {
    "id": "cuid",
    "amount": 100.00,
    "currency": "USD",
    "status": "COMPLETED",
    "paymentProvider": "stripe",
    "message": "Keep up the great work!",
    "campaign": {
      "id": "cuid",
      "title": "Campaign Title"
    },
    "receiptUrl": "https://...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Campaigns

#### GET /api/campaigns
Get all active campaigns.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `active`: boolean (default: true)

**Response (200):**
```json
{
  "campaigns": [
    {
      "id": "cuid",
      "title": "Campaign Title",
      "description": "Campaign description...",
      "goal": 10000.00,
      "raised": 5000.00,
      "currency": "USD",
      "imageUrl": "https://...",
      "active": true,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### GET /api/campaigns/:id
Get specific campaign details.

**Response (200):**
```json
{
  "campaign": {
    "id": "cuid",
    "title": "Campaign Title",
    "description": "Detailed campaign description...",
    "goal": 10000.00,
    "raised": 5000.00,
    "currency": "USD",
    "imageUrl": "https://...",
    "active": true,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.000Z",
    "donations": {
      "count": 150,
      "recent": [
        {
          "amount": 50.00,
          "anonymous": false,
          "user": {
            "firstName": "John",
            "lastName": "D."
          },
          "createdAt": "2024-01-15T00:00:00.000Z"
        }
      ]
    }
  }
}
```

### Admin

#### GET /api/admin/verification-requests
Get all verification requests (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status`: string (optional: "PENDING", "VERIFIED", "REJECTED")
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response (200):**
```json
{
  "requests": [
    {
      "id": "cuid",
      "user": {
        "id": "cuid",
        "email": "user@example.com",
        "profile": {
          "firstName": "John",
          "lastName": "Doe"
        }
      },
      "documentType": "passport",
      "documentUrl": "https://...",
      "status": "PENDING",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 30,
    "totalPages": 3
  }
}
```

#### PUT /api/admin/verification-requests/:id
Update verification request status (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "VERIFIED",
  "reviewNotes": "Documents verified successfully"
}
```

**Response (200):**
```json
{
  "verificationRequest": {
    "id": "cuid",
    "status": "VERIFIED",
    "reviewedAt": "2024-01-02T00:00:00.000Z",
    "reviewNotes": "Documents verified successfully"
  }
}
```

#### GET /api/admin/stats
Get platform statistics (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "stats": {
    "users": {
      "total": 1000,
      "verified": 750,
      "pendingVerification": 150
    },
    "donations": {
      "total": 50000.00,
      "count": 500,
      "avgAmount": 100.00
    },
    "campaigns": {
      "active": 5,
      "completed": 10,
      "totalRaised": 50000.00
    }
  }
}
```

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation error: email is required"
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- Default: 100 requests per 15 minutes per IP
- Authenticated: 1000 requests per 15 minutes per user

When rate limited, the API returns:
```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded"
}
```

## Webhooks

### Payment Provider Webhooks

#### POST /api/webhooks/stripe
Stripe webhook endpoint for payment events.

**Headers:**
- `stripe-signature`: Stripe signature for verification

**Events Handled:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

## Testing

Use the following test credentials in development:

**Test User:**
- Email: `test@example.com`
- Password: `testPassword123`

**Test Admin:**
- Email: `admin@example.com`
- Password: `adminPassword123`

**Test Payment:**
- Card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC
