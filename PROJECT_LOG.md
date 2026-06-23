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


