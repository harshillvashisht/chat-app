# Day 1 - System Design

## Goal

Design the architecture for the real-time chat application before writing code.

## Completed

### Core Features

* User registration
* User login
* User search
* Friend requests
* Friend request acceptance
* Chat creation
* Real-time messaging

### Database Entities Identified

* User
* FriendRequest
* Chat
* Message

### Architecture Decisions

* Use IDs instead of usernames as foreign keys
* Store hashed passwords instead of raw passwords
* Create chats automatically when friend requests are accepted
* Persist messages in database before sending through websocket
* Support offline users through database persistence

### Additional Design Decisions

* Cursor pagination for message history
* Unread message tracking using lastReadMessageId
* Store last message information in Chat table
* Prevent duplicate friend requests
* Prevent duplicate chats
* Prevent self friend requests

## Outcome

System design is sufficiently complete to begin implementation.
Next step: create project structure and Prisma schema.

## Future Features (V2)
- Read receipts
- Last read message tracking
- Typing indicators
- Online presence

# Day 2 - Database Setup

## Completed

- Designed User schema
- Designed FriendRequest schema
- Designed Chat schema
- Designed Message schema
- Added relations
- Connected Neon
- Ran first migration
- Generated Prisma client
- Bootstrapped Express server
- Verified localhost server works

## Next Session

Auth milestone:
- Register endpoint
- Login endpoint
- JWT generation
- Password hashing

# Day 3 - Auth routes setup 

## Completed

## Authentication Module

Implemented user registration endpoint.

Features:

* User creation using Prisma
* Password hashing with bcrypt
* Duplicate email protection
* Zod request validation
* Structured API responses

Implemented user login endpoint.

Features:

* Email lookup using Prisma
* Password verification with bcrypt.compare()
* Invalid credential handling
* Safe user response (excluding password)

## Backend Architecture

Implemented:

* Service layer
* Controller layer
* Route layer
* Global error middleware
* Custom ApiError class
* Validation schemas using Zod

## Testing

Verified using Postman:

* Successful registration
* Duplicate email handling
* Missing field validation
* Invalid input validation
* Successful login
* Invalid password handling
* Non-existent user handling

## Next Steps

1. JWT Fundamentals
2. Access Token Generation
3. Return JWT on Login
4. Authentication Middleware
5. Protected Route Testing

# Day 4 - JWT middleware and login setup 

## Features Implemented

### Authentication

* User registration endpoint completed.
* User login endpoint completed.
* Password hashing and verification implemented.
* JWT generation implemented after successful login.

### Authorization

* Authentication middleware created.
* Bearer token extraction implemented.
* JWT verification implemented.
* Decoded user payload attached to req.user.

### Protected Routes

* Created protected test route (/me).
* Verified authenticated requests using Postman.
* Successfully returned authenticated user information from token payload.

### TypeScript Improvements

* Created AuthUser interface.
* Extended Express Request interface with user property.
* Removed TypeScript errors related to req.user.
* Added proper typing for authenticated requests.

### Testing & Verification

* Tested login flow.
* Tested JWT generation.
* Tested JWT verification.
* Tested protected route access.
* Confirmed end-to-end authentication flow is functioning correctly.

## Challenges Faced

* Authorization header handling.
* Understanding Bearer token extraction.
* Debugging JWT verification failures.
* Fixing req.user TypeScript errors.
* Diagnosing invalid signature errors.
* Correcting Postman JWT usage.

## Milestone Status

✅ Register

✅ Login

✅ Password Hashing

✅ JWT Generation

✅ JWT Verification

✅ Authentication Middleware

✅ Protected Routes

✅ Typed req.user

Authentication system completed successfully.

## Next Phase

* Users
* Conversations
* Messages
* Real-Time Messaging (Socket.IO)

### User Search Endpoint

Implemented authenticated user search functionality.

Endpoint:

GET /api/v1/users/search?username=<query>

---

## Backend Flow

Request

↓

Route

↓

Controller

↓

Service

↓

Prisma Query

↓

Response

---

## Functionality

* Search users by partial username.
* Perform case-insensitive matching.
* Exclude the currently authenticated user.
* Return only safe user fields.
* Validate required query parameter.

---

## Security and Data Handling

Returned:

* id
* username

Excluded:

* password
* email

This follows the principle of least data exposure.

---

## Testing Completed

Verified:

* Partial match search
* Case-insensitive search
* Self-search exclusion
* Empty search results
* Missing username query parameter

All tests passed successfully.

---

## Current Project Status

✅ Register

✅ Login

✅ Password Hashing

✅ JWT Authentication

✅ Auth Middleware

✅ Protected Routes

✅ User Search

### Next Planned Feature

Friend Request System

Flow:

Search User

↓

Send Friend Request

↓

Accept Friend Request

↓

Auto Create Chat

# Day 5 - friend request and message endpoints 

### Friend Requests

Implemented:

* Send Friend Request
* Prevent Self Requests
* Prevent Duplicate Requests
* Prevent Reverse Duplicate Requests
* Get Incoming Friend Requests
* Accept Friend Requests

---

### Chat Creation

Implemented automatic chat creation when a friend request is accepted.

Added participant normalization:

```ts
const participant1Id = Math.min(senderId, receiverId);
const participant2Id = Math.max(senderId, receiverId);
```

to guarantee a single chat per user pair.

---

### Messaging

Implemented:

#### Send Message

Endpoint:

```http
POST /message/chat/:chatId
```

Features:

* Chat existence validation
* Participant authorization validation
* Content validation
* Transactional message creation
* Automatic update of:

  * lastMessage
  * lastMessageAt

#### Get Messages

Endpoint:

```http
GET /message/chat/:chatId
```

Features:

* Chat existence validation
* Participant authorization validation
* Chronological message retrieval

---

## Current Application Flow

```text
Register
↓
Login
↓
Search User
↓
Send Friend Request
↓
Accept Friend Request
↓
Chat Created
↓
Send Message
↓
Read Messages
```

---

## Current Status

Completed MVP backend flow for one-to-one messaging.

Core functionality now exists from user discovery all the way to message exchange.

Next likely feature:

```text
Get My Chats
```

to allow users to discover and open existing conversations.

## Next features

Login
↓
Get My Chats
↓
View Recent Conversations
↓
Open Chat
↓
View Other Participant
↓
Continue Conversation

# Day 6 - Get messages and friend request reject

### Chat Discovery

Implemented:

```http
GET /chat
```

Features:

* Fetch all chats for the authenticated user
* Load participant information using Prisma relations
* Determine and return the other participant
* Return:

  * Chat ID
  * Other User
  * Last Message
  * Last Message Timestamp
* Sort chats by latest activity

Example Response:

```json
{
  "id": 1,
  "otherUser": {
    "id": 2,
    "username": "john"
  },
  "lastMessage": "Hello",
  "lastMessageAt": "..."
}
```

---

### Friend Request Rejection

Implemented:

```http
POST /friendRequest/:id/reject
```

Validation:

* Request exists
* Current user is the receiver
* Request status is PENDING

Action:

```text
PENDING
↓
REJECTED
```

---

### Friend Request Re-send Flow

Updated friend request handling logic.

Behavior:

```text
PENDING
↓
Blocked
```

```text
ACCEPTED
↓
Blocked
```

```text
REJECTED
↓
Revived To PENDING
```

Maintains:

```prisma
@@unique([senderId, receiverId])
```

without requiring additional database rows.

---

### Testing Completed

Verified full lifecycle:

```text
Send Request
↓
Reject Request
↓
Re-send Request
↓
Accept Request
↓
Chat Created
```

All transitions behave correctly.

---

# Current Backend Status

```text
✅ Register
✅ Login
✅ JWT Middleware

✅ User Search

✅ Send Friend Request
✅ Get Incoming Requests
✅ Accept Friend Request
✅ Reject Friend Request

✅ Auto Create Chat

✅ Get Chats

✅ Send Message
✅ Get Messages
```

---

# Next Major Feature

## Realtime Messaging (Socket.IO)

Goal:

```text
User A Sends Message
↓
Server Receives Message
↓
Server Pushes Message To User B Instantly
↓
No Page Refresh Required
```

Topics To Learn:

* WebSockets
* Socket.IO
* Events
* Emit / On
* Rooms
* User-to-Socket Mapping
* Realtime Message Delivery

Planned Progression:

```text
Understand HTTP Limitations
↓
Learn WebSocket Fundamentals
↓
Integrate Socket.IO
↓
Create Chat Rooms
↓
Realtime Messaging
↓
Online User Presence
```

