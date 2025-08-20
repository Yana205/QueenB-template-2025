# QueenB API Documentation

## Base URL
- Development: `http://localhost:5000/api`

## 🔐 Authentication Endpoints

### User Registration
```
POST /api/auth/signup
Content-Type: application/json

{
  "userType": "mentor", // or "mentee"
  "firstName": "Sarah",
  "lastName": "Cohen",
  "email": "sarah@example.com",
  "password": "MySecurePassword123!",
  "phone": "050-1234567",
  
  // Mentor-specific fields
  "technologies": ["JavaScript", "React", "Node.js"],
  "yearsOfExperience": 5,
  "description": "Full-stack developer",
  "linkedinUrl": "https://linkedin.com/in/sarahcohen"
}
```

### User Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "sarah@example.com",
  "password": "MySecurePassword123!",
  "userType": "mentor" // optional
}
```

### Get Current User Profile
```
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "firstName": "Sarah",
      "lastName": "Cohen",
      "email": "sarah@example.com",
      "technologies": ["JavaScript", "React"],
      "yearsOfExperience": 5
    },
    "userType": "mentor"
  }
}
```

---

---

## 🧑‍🏫 Mentor Endpoints

### Get All Mentors
```
GET /api/mentors
```
**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "firstName": "Sarah",
      "lastName": "Cohen",
      "email": "sarah@example.com",
      "technologies": ["JavaScript", "React"],
      "yearsOfExperience": 5
    }
  ]
}
```

### Search Mentors
```
GET /api/mentors/search?technology=React&name=Sarah
```
**Query Parameters:**
- `technology` (optional): Search by technology/skill
- `name` (optional): Search by first or last name

### Get Single Mentor
```
GET /api/mentors/:id
```

### Create New Mentor
```
POST /api/mentors
Content-Type: application/json

{
  "firstName": "Sarah",
  "lastName": "Cohen",
  "email": "sarah@example.com",
  "phone": "050-1234567",
  "technologies": ["JavaScript", "React", "Node.js"],
  "yearsOfExperience": 5,
  "description": "Full-stack developer",
  "linkedinUrl": "https://linkedin.com/in/sarahcohen"
}
```

### Update Mentor
```
PUT /api/mentors/:id
Content-Type: application/json

{
  "yearsOfExperience": 6,
  "technologies": ["JavaScript", "React", "Node.js", "MongoDB"]
}
```

### Delete Mentor
```
DELETE /api/mentors/:id
```

---

## 👩‍🎓 Mentee Endpoints

### Get All Mentees
```
GET /api/mentees
```

### Get Single Mentee
```
GET /api/mentees/:id
```

### Register New Mentee
```
POST /api/mentees
Content-Type: application/json

{
  "firstName": "Rachel",
  "lastName": "Levy",
  "email": "rachel@example.com",
  "phone": "052-9876543",
  "description": "Looking for React mentorship",
  "lookingFor": ["React", "JavaScript"]
}
```


### Update Mentee
```
PUT /api/mentees/:id
```

### Delete Mentee
```
DELETE /api/mentees/:id
```

---

## 🏥 Health Check

### Server Health
```
GET /api/health
```
**Response:**
```json
{
  "status": "OK",
  "message": "QueenB API is running!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "MongoDB Connected"
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here",
  "errors": ["Array of validation errors if applicable"]
}
```

### Common Status Codes:
- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation error)
- `404` - Resource not found
- `500` - Server error

---

## Testing with cURL

### Create a Mentor:
```bash
curl -X POST http://localhost:5000/api/mentors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Mentor",
    "email": "test@example.com",
    "phone": "050-1111111",
    "technologies": ["Python", "Django"],
    "yearsOfExperience": 3
  }'
```

### Create a Mentee:
```bash
curl -X POST http://localhost:5000/api/mentees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Mentee",
    "email": "mentee@example.com",
    "phone": "050-2222222",
    "lookingFor": ["Python"]
  }'
```

### Search for Python mentors:
```bash
curl http://localhost:5000/api/mentors/search?technology=Python
```

---

## Database Schema Reference

### Mentor Schema
- `firstName` (String, required)
- `lastName` (String, required)
- `email` (String, required, unique)
- `phone` (String, required)
- `technologies` (Array of Strings, required)
- `yearsOfExperience` (Number, required)
- `description` (String, optional)
- `linkedinUrl` (String, optional)
- `profileImage` (String, optional)
- `availability` (String: 'available'|'busy'|'offline')
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

### Mentee Schema
- `firstName` (String, required)
- `lastName` (String, required)
- `email` (String, required, unique)
- `phone` (String, required)
- `description` (String, optional)
- `lookingFor` (Array of Strings, optional)
- `matchedMentors` (Array of matches)
- `profileCompleted` (Boolean)
- `isActive` (Boolean)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)
