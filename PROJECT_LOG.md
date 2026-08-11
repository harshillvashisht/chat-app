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

# Day 6 - Get messages and friend request reject and socket.io setup

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

Current Backend Status

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

Next Major Feature

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

### Chat Discovery

Implemented:

```http
GET /chat
```

Returns:

```json
{
  "id": 1,
  "otherUser": {
    "id": 2,
    "username": "john"
  },
  "lastMessage": "...",
  "lastMessageAt": "..."
}
```

Learned:

* Prisma relation includes
* Response transformation using map()
* Returning frontend-friendly DTOs

---

### Friend Request Rejection

Implemented:

```http
POST /friendRequest/:id/reject
```

Flow:

```text
Validate Request
↓
Validate Receiver
↓
Validate Pending Status
↓
Update Status To REJECTED
```

---

### Resend After Rejection Fix

Problem:

```text
Rejected requests could not be sent again.
```

Cause:

```prisma
@@unique([senderId, receiverId])
```

Solution:

```text
If request is REJECTED
↓
Update Status Back To PENDING
↓
Reuse Existing Row
```

Tested:

```text
Send
↓
Reject
↓
Resend
↓
Accept
```

Successfully working.

---

### Socket.IO Foundation

Implemented:

```text
HTTP Server Creation
Socket.IO Initialization
Socket Authentication Middleware
JWT Handshake Authentication
Socket Connection Testing
```

Verified:

```text
Client Connects
↓
JWT Verified
↓
User Attached To Socket
↓
Connection Accepted
```

---

## Current Backend Status

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

✅ Socket.IO Server
✅ Socket.IO Authentication
```

---

## Next Feature

### Socket.IO Room Management

Flow:

```text
Socket Connect
↓
Authenticated User Available
↓
Fetch User Chats
↓
Join chat_<id> Rooms
↓
Verify Room Membership
```

Expected Result:

```text
User automatically joins all chat rooms
they participate in.
```

---

## After Room Management

### Realtime Message Delivery

Flow:

```text
POST /messages
↓
Save To Database
↓
Emit Socket Event
↓
Deliver Message To Chat Room
```

REST remains the source of truth.

Socket.IO becomes the realtime delivery layer.


# Day 7  - socket.io rooms made and updates messages endpoint 

## Dynamic Room Joining

### What was built

When a user connects via Socket.IO:

1. Socket authentication middleware verifies JWT.
2. Connection handler runs.
3. Backend fetches all chats belonging to the user.
4. User automatically joins all corresponding chat rooms.

Example:

User 1 chats:
- chat_1
- chat_5

Connection
    ↓
join chat_1
join chat_5

### Why it matters

Rooms allow targeting only relevant users instead of broadcasting events globally.

Without rooms:

emit
    ↓
every connected user receives it

With rooms:

emit to chat_1
    ↓
only chat_1 participants receive it

---

## Realtime Message Delivery

### What was built

After a message is successfully created:

Create message
    ↓
Update chat metadata
    ↓
Emit new_message

The controller emits the newly created message to:

chat_${chatId}

room.

### Result

Participants receive new messages instantly without refreshing or polling.

---

## End-to-End Verification

Verified complete flow:

User connects
    ↓
Joins chat rooms
    ↓
POST /messages
    ↓
Message stored in DB
    ↓
Socket event emitted
    ↓
Client receives payload

Observed payload:

{
  id: 4,
  chatId: 1,
  senderId: 2,
  content: "good morning",
  createdAt: "..."
}

---

Status:

✓ Dynamic room joining implemented
✓ Room architecture verified
✓ Realtime message emission implemented
✓ Realtime message reception verified
✓ End-to-end messaging flow working

# Day 8 - tested backend api's and fixed bugs 

Chat App Status:

Backend V1 Complete

✓ Auth
✓ Friend Requests
✓ Chats
✓ Messages
✓ Socket Rooms
✓ Realtime Messaging

Verified End-to-End:
Request → Accept → Chat → Message → Realtime Delivery

Next Step:
Frontend Architecture Session

# Day 9 - created frontend routes and auth page login

Chat App Frontend

Completed:
- Created Vite React TypeScript frontend project.
- Installed:
  - react-router-dom
  - axios
  - socket.io-client
- Created frontend folder structure:
  - pages
  - components
  - services
  - socket
- Created:
  - AuthPage
  - ChatPage
  - LoginForm
  - RegisterForm
- Configured routes:
  - /auth
  - /chat
- Verified routing works in browser.
- Implemented AuthPage toggle between LoginForm and RegisterForm.

Next:
- Build LoginForm UI.
- Build RegisterForm UI.
- Add form state using useState.
- Connect forms to backend auth endpoints.

# Day 10 - made loginform and registerform and connected with backend

- Added Tailwind CSS to the frontend.
- Built AuthPage with Login/Register toggle.
- Implemented LoginForm and RegisterForm.
- Created reusable Axios instance and auth API service.
- Connected login and registration to the backend.
- Verified successful login, cookie storage, navigation, and session persistence after refresh.

# Day 11 - Created the initial Chat Page layout with `Sidebar` and `ChatArea`.

- Added reusable components:
  - Sidebar
  - SearchUser
  - ChatList
  - ChatHeader
  - MessageList
  - MessageInput
- Implemented the Friend Requests button and modal UI.
- Added dummy chat messages and dummy friend request data for layout testing.
- Styled the initial chat page using Tailwind CSS to establish the application's overall structure.

# Day 12 - connected backend apis with frontend , made pages dynamic 

* Updated frontend types to match backend API responses.
* Connected chat list to the backend using `GET /chats`.
* Connected message list to the backend using chat-specific message fetching.
* Connected friend request modal to backend pending request data.
* Replaced hardcoded chat, message, and friend request UI with dynamic rendering.
* Added chat selection flow and automatic message loading using `useEffect`.
* Implemented accept and decline friend request actions with immediate UI updates after successful API responses.
* Prepared the application for the next milestone: real-time messaging with Socket.IO.

# Day 13 - socket client implementation , realtime message testing 

Implemented real-time messaging with Socket.IO.

Connected frontend socket after login.

Authenticated sockets using JWT cookies.

Joined all user chat rooms on connection.

Emitted new_message events from the backend.

Received real-time events on the frontend.

Verified live messaging between two different browsers/users.

# Day 14 - implemented userSearch and Ui improvements

## Authentication
- Added `/auth/me` endpoint.
- Integrated authenticated user fetching on the frontend.
- Removed the temporary hardcoded current user ID.
- Fixed message alignment using the authenticated user.

## Real-Time Chat
- Sidebar now updates immediately when new messages arrive.
- Chats automatically move to the top based on the latest activity.
- Implemented auto-scroll to the newest message.

## User Search
- Integrated live user search API.
- Added search results panel.
- Implemented relationship-aware search results.
- Added conditional button states:
  - Add Friend
  - Pending
  - Friends
  - Check Requests
- Implemented optimistic UI update after sending friend requests.

## Friend Requests
- Chat list refreshes immediately after accepting a friend request.
- Connected search flow with the existing friend request system.

## Notes
- Discovered shortcomings in the original API contract for the search feature.
- Decided to improve our future development process by designing:
  1. UI
  2. API Contract
  3. Edge Cases
  4. Backend
  5. Frontend
before implementing new features.

# Day - 15 fixed socket bugs and debounced the search

### Completed
- Fixed Socket.IO reconnection after browser refresh.
- Moved socket connection logic to the authenticated flow (`getCurrentUser`) instead of relying only on the login page.
- Added debounced user search (400ms delay) using `useEffect`, `setTimeout`, and `clearTimeout`.
- Verified both features are working correctly.

### Decision
- Feature development for Chat App v1 is considered complete.
- Next phase: deployment instead of adding more frontend polish.

# Chat App v1 - Project Log

## Duration

~15 days

---

## Goal

Build and deploy a production-ready real-time chat application while learning modern backend development.

---

## Major Milestones

### Backend

- Express server setup
- Prisma integration
- PostgreSQL database
- Authentication
- JWT
- Cookie authentication
- Friend request system
- Chat APIs
- Socket.IO integration

### Frontend

- Authentication pages
- Sidebar
- Chat interface
- Search users
- Friend requests
- Real-time message updates
- Auto-scroll
- Responsive layout

### Deployment

- Neon PostgreSQL
- Render backend
- Vercel frontend
- Production environment variables
- Production CORS
- Production cookies

---

## Biggest Challenges

- Socket.IO authentication
- Cookie-based authentication across different domains
- Production deployment
- React Router deployment
- TypeScript production builds
- Environment configuration

---

## Result

Successfully deployed a fully functional real-time chat application.

Users can:

- Register
- Login
- Add friends
- Chat in real time
- Refresh without losing messages

Project Status:

✅ Completed (Version 1)

# Chat App v2 - Project log started

# Day 1 - implemented schema changes and idempotency

### Database Schema

* Added a new `Attachment` model to support future file attachments.
* Updated the `Message` model:

  * Added a nullable `clientMessageId` field with a unique constraint to support idempotent message creation.
  * Made `content` nullable so the schema can support attachment-only messages in future phases.
* Generated and applied the corresponding Prisma migration.

### Message Service Refactor

Refactored the `sendMessage` service to support idempotent message creation.

Instead of querying the database first to check whether a message with the same `clientMessageId` already existed, the service now:

1. Attempts to create the message directly.
2. Relies on the database's unique constraint to detect duplicate requests.
3. If Prisma throws a `P2002` (unique constraint violation), fetches and returns the already-created message instead of creating a duplicate.

This keeps the common execution path efficient while still correctly handling client retries.

## Notes

* Attachment storage and upload integration are intentionally deferred to a later project phase.
* This work lays the foundation for retry-safe message delivery and future reconnect synchronization.

# Day 2 - Message reliability — clientMessageId, optimistic UI, socket reconciliation, and message states.

### Work Completed

1. Frontend clientMessageId
- Added clientMessageId to the frontend Message type.
- Generated a unique clientMessageId using crypto.randomUUID() whenever a new message is sent.
- Passed the clientMessageId along with the message content to the backend.
- Kept clientMessageId as the stable identifier connecting the optimistic message, database message, and Socket.IO message.

2. UIMessage and Message States
- Introduced a separate UIMessage type to represent messages while they are being processed on the client.
- Added message status:
  - sending
  - sent
  - failed
- Optimistic messages do not have a database id yet, so the database id remains optional on UIMessage.

3. Optimistic UI
- Implemented optimistic message insertion.
- A message is added to the UI immediately when the user presses Send instead of waiting for the backend.
- Newly created messages initially have status = "sending".
- Historical messages fetched from the backend are initialized with status = "sent".

4. Socket Echo / Duplicate Message Bug
- Discovered that the server broadcasts messages using io.to(chatId), which also sends the newly-created message back to the sender.
- This caused the same message to appear twice:
  - once from the optimistic UI
  - once from the Socket.IO event
- Fixed this by introducing an upsertMessage() function based on clientMessageId.
- If the clientMessageId already exists in the local message list, the incoming message updates the existing message instead of being appended.
- If it does not exist, the message is inserted normally.

5. Message List Identity
- Changed the React message key from the database id to clientMessageId.
- This allows optimistic messages and confirmed server messages to use the same stable identity.
- Existing database messages were backfilled with clientMessageId before relying on it as the message identity.

6. Failure Handling
- Added failure handling to the send operation.
- If the HTTP request fails, the optimistic message is changed from "sending" to "failed".
- The failed message remains visible instead of silently disappearing.

7. Message Status UI
- Added temporary visual indicators for:
  - Sending
  - Sent
  - Failed
- Verified that the message correctly transitions between these states.

### Testing

Successfully tested:

- Normal message sending.
- Multiple messages sent quickly.
- Optimistic message appearing immediately.
- Sending → Sent transition.
- Sending → Failed transition.
- Two browser tabs connected to the same chat.
- Sender receiving its own Socket.IO message without creating a duplicate.
- Receiver getting exactly one copy of the message.
- No React duplicate-key warnings.

### Current Message Flow

User sends message
    ↓
Generate clientMessageId
    ↓
Create optimistic UIMessage
status = sending
    ↓
Add immediately to UI
    ↓
HTTP request → backend
    ↓
Backend saves message
    ↓
Backend emits Socket.IO event
    ↓
Client receives message
    ↓
Match using clientMessageId
    ↓
Upsert existing optimistic message
    ↓
status = sent

If HTTP request fails:

sending → failed

### Next Task

Implement retry functionality for failed messages.

The retry flow will use the same clientMessageId so that the backend's idempotency mechanism can prevent duplicate database messages.

# Day 3 - Message retry , fixed old idempotency logic 

Continued development of Chat App v2 with a focus on reliable message delivery.

Implemented and verified:

* Client-generated `clientMessageId` for every outgoing message.
* Backend idempotency using `clientMessageId`.
* Optimistic message rendering on the frontend.
* Duplicate-message prevention when the same message request is received multiple times.
* Frontend message states:

  * `sending`
  * `sent`
  * `failed`
* Retry functionality for failed messages.
* Retry reuses the original `clientMessageId` instead of generating a new ID.
* Retry state transitions:

  * `failed → sending → sent`
  * `failed → sending → failed`
* Retry success continues to use the existing Socket.IO `new_message` event for final message reconciliation.
* Tested normal sending, failed sending, successful retry, repeated retry failure, and duplicate prevention.

### Reliability flow

```text
User sends message
       ↓
Optimistic UI
       ↓
clientMessageId generated
       ↓
Backend
       ↓
Database idempotency check
       ↓
Socket confirmation
       ↓
Message marked sent

If request fails:
       ↓
Message marked failed
       ↓
User clicks Retry
       ↓
Same clientMessageId reused
       ↓
Backend safely processes/reconciles request
```

### Result

The messaging system now handles temporary send failures without requiring the user to recreate the message manually, while the existing backend idempotency mechanism protects retries from creating duplicate messages.
