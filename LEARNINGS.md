# Learning Notes

# 2026-06-20
## IDs vs Usernames

Do not use usernames as foreign keys.

Reason:

* Usernames can change.
* IDs are stable.

Use:

* senderId
* receiverId

instead of usernames.

---

## Message Ownership

Messages belong to chats.

Message:

* id
* chatId
* senderId
* content
* createdAt

Chat determines participants.

---

## Pagination

Do not load all messages.

Load:

* latest 25 messages

When user scrolls:

* request older messages
* use oldest loaded message as cursor

Example:
GET /messages?before=76

---

## Offline Messages

Always save messages to database first.

If recipient is online:

* send websocket event

If recipient is offline:

* message remains stored

Messages are loaded when user opens chat.

---

## Unread Counts

Receiving a websocket event does not mean message is read.

Track:

* lastReadMessageId

Unread count:

* messages after lastReadMessageId

---

## Duplicate Prevention

Before creating:

* FriendRequest
* Chat

Check whether one already exists.

Reject duplicates.

---

## Backend Design Principle

Think in entities and relationships.

Entities:

* User
* FriendRequest
* Chat
* Message

Before coding ask:

* What data exists?
* Who owns it?
* How is it related?

# 2026-06-21

## Prisma

- Foreign keys live on the many side.
- Relation arrays are mostly for reverse traversal and Prisma convenience.
- validate checks schema syntax, not architecture quality.
- generate creates the Prisma client.
- migrate creates actual database tables.

## Git

- Git can be initialized at a parent folder and track nested projects.

## Express

- app.ts creates/configures the app.
- server.ts starts the app.
- express.json() parses incoming JSON bodies.

# 2026-06-22

## Custom Error Handling

Learned why a custom ApiError class should extend JavaScript's built-in Error class. This allows application-specific information such as statusCode to be attached while still behaving like a normal error object.

## Error Propagation in Express

Learned how errors flow through an Express application:

Request → Controller → Service → throw Error → next(error) → Error Middleware → Response

Instead of handling errors inside every controller, errors can be passed to a centralized middleware using next(error).

## Global Error Middleware

Implemented a centralized error handling system capable of handling:

* ApiError instances
* Zod validation errors
* Unknown server errors

This keeps controllers and services clean while ensuring consistent API responses.

## Zod Validation

Learned how to create schemas for request validation and validate incoming request bodies using:

* string validation
* email validation
* minimum length validation

Also learned that Zod throws a ZodError when validation fails.

## Error Type Detection

Learned to distinguish different error types using instanceof rather than checking string names.

Examples:

* err instanceof ApiError
* err instanceof ZodError

## Authentication Fundamentals

Implemented user registration and login flows.

Registration flow:

* Validate request data
* Check for existing email
* Hash password using bcrypt
* Store user in database

Login flow:

* Validate request data
* Find user by email
* Compare passwords using bcrypt.compare()
* Return user information if authenticated

## HTTP Status Codes

Improved understanding of common status codes:

* 200 OK → Successful login
* 201 Created → Successful registration
* 400 Bad Request → Validation errors
* 401 Unauthorized → Invalid credentials
* 409 Conflict → Duplicate email
* 500 Internal Server Error → Unexpected failures

## Biggest Insight

The hardest part of authentication was not implementing login itself. The difficult part was building the architecture around it:

* Services
* Controllers
* Validation
* Error handling

Once the architecture was in place, implementing login became straightforward.

# 2026-06-23

## JWT Fundamentals

* JWT is encoded, not encrypted.
* JWT payload can be decoded by anyone possessing the token.
* Sensitive data should not be stored inside JWT payloads.
* JWT signing and verification must use the same secret.

## Login Flow

* Verify user credentials.
* Generate JWT using jwt.sign().
* Return token to client.
* Client stores token and sends it on future requests.

## Authentication Middleware

* Read Authorization header from incoming requests.
* Understand Bearer token format:
  Authorization: Bearer <token>
* Extract token using split(" ").
* Verify token using jwt.verify().
* Attach decoded payload to req.user.
* Call next() to continue request execution.

## Express Middleware Concepts

* Middleware executes before route handlers.
* Protected routes can be secured by placing auth middleware before routes.
* Middleware can modify the request object before passing control.

## TypeScript Learning

* Express Request does not contain a user property by default.
* Extend Express Request using declaration merging.
* Create custom AuthUser interface.
* Add AuthUser to Request type for autocomplete and type safety.
* Use type assertions when working with jwt.verify() results.

## Debugging Lessons

* Use console logs to identify where execution stops.
* Read actual error messages before changing code.
* jwt.verify() throws errors rather than returning null.
* Invalid signature errors usually indicate a token or secret mismatch.
* Not every bug is in the code; sometimes the tool usage is incorrect.

## Authentication Flow Understanding

Login
→ Generate JWT
→ Client stores token
→ Client sends token in Authorization header
→ Middleware extracts token
→ Middleware verifies token
→ User data attached to req.user
→ Protected route executes

## User Search API Design

Learned that searching users should use query parameters rather than path parameters.

Example:

GET /api/v1/users/search?username=har

Reason:

* Search is filtering a collection of users.
* Multiple results may be returned.
* Query parameters are designed for filtering.

---

## Partial Username Search

Implemented partial matching using Prisma.

Users do not need to remember the exact username.

Example:

Search:

har

Matches:

* harsh
* harry
* harshill

---

## Case-Insensitive Search

Learned how to perform case-insensitive searches in Prisma.

Example:

HAR
har
HaR

all return the same results.

This improves user experience and prevents unnecessary search failures.

---

## Excluding Current User

Learned that business rules can often be enforced directly in database queries.

Used a NOT condition to exclude the authenticated user from search results.

Reason:

* Users should not send friend requests to themselves.
* Unnecessary data is not returned from the database.

---

## Data Exposure Principle

Only return the data required by the feature.

For user search, return:

* id
* username

Do not return:

* password
* email
* internal fields

Principle:

Return the minimum data needed for the frontend to function.

---

## Search Input Sanitization

Usernames cannot contain spaces.

Removed spaces from the search query before querying the database.

Example:

"har sh"

becomes:

"harsh"

This makes searches more forgiving and user-friendly.

---

## API Testing

Verified the following cases:

* Partial username search
* Case-insensitive search
* Searching own username
* Nonexistent username
* Missing query parameter

Testing edge cases is important before considering a feature complete.

# 2026-06-24

## 1. Database Constraints vs Application Logic

Today I learned that database constraints and application logic solve different problems.

For example:

```prisma
@@unique([senderId, receiverId])
```

prevents duplicate rows from being inserted into the database, but it does not replace business logic checks.

I still need application-level validation for cases such as:

* Sending a friend request to myself
* Returning a user-friendly error message before the database throws an error
* Preventing reverse friend requests from creating duplicate relationships

I also learned that database constraints are the final safety net, not the first line of validation.

---

## 2. Canonical Representation of Relationships

A unique constraint on:

```prisma
@@unique([participant1Id, participant2Id])
```

does not prevent:

```text
(1,2)
(2,1)
```

because those are different tuples.

To solve this, I normalize the order before creating a chat:

```ts
const participant1Id = Math.min(senderId, receiverId);
const participant2Id = Math.max(senderId, receiverId);
```

This guarantees that every chat between two users is represented the same way.

---

## 3. Prisma Relations and Select

I learned how to fetch related data directly through Prisma relations.

Example:

```ts
select: {
    id: true,
    sender: {
        select: {
            id: true,
            username: true
        }
    }
}
```

This allowed me to return incoming friend requests together with sender information without writing SQL joins manually.

---

## 4. Transactions

I used Prisma transactions in two scenarios:

### Friend Request Acceptance

* Update request status
* Create chat

Both operations must succeed together.

### Message Sending

* Create message
* Update chat metadata

Both operations must succeed together.

I learned two transaction styles:

```ts
prisma.$transaction([
    ...
])
```

and

```ts
prisma.$transaction(async (tx) => {
    ...
})
```

The callback version is useful when later queries depend on results from earlier queries.

I also learned that `tx` is simply a transaction-scoped Prisma client.

---

## 5. Authorization Patterns

A recurring backend pattern appeared today:

```text
Find Resource
↓
Existence Check
↓
Authorization Check
↓
Business Validation
↓
Database Operation
```

I used this pattern in:

* Accept Friend Request
* Send Message
* Get Messages

---

## 6. Common Bugs Encountered

### Missing await

I accidentally wrote:

```ts
const chat = prisma.chat.findUnique(...)
```

instead of:

```ts
const chat = await prisma.chat.findUnique(...)
```

which caused TypeScript to treat the value as a Promise instead of a Chat object.

### Route Parameter Mistake

I called:

```text
/ friendRequest/:1/accept
```

instead of:

```text
/ friendRequest/1/accept
```

which resulted in `NaN` being parsed from the route parameter.

### Authorization Logic

I initially used:

```ts
||
```

where

```ts
&&
```

was required.

This reminded me that authorization conditions must be tested carefully using actual values.

---

## 7. Messaging Design

For message retrieval I chose:

```ts
orderBy: {
    createdAt: "asc"
}
```

because conversations should be read chronologically.

I also learned that chat lists are usually sorted differently:

```ts
lastMessageAt: "desc"
```

so the most recently active chats appear first.

---

## Key Takeaway

Today reinforced that backend development is less about writing queries and more about designing system behavior, validation rules, authorization checks, and data consistency.

# 2026-06-25

## 1. N+1 Query Problem

A naive implementation of `GET /chat` would fetch all chats and then execute an additional query for each chat to retrieve the other user's information.

Example:

```text
Get Chats
↓
For Each Chat
↓
Fetch Other User
```

This results in:

```text
1 Chat Query
+
N User Queries
```

which does not scale well.

Using Prisma relations with `include` allows all required data to be fetched in a single query.

---

## 2. API Responses Should Be Designed For Clients

Database structures and API responses do not have to look the same.

Database:

```text
participant1
participant2
```

API Response:

```text
otherUser
```

A transformation layer can reshape database results into a format that is easier for the frontend to consume.

Example:

```ts
const result = chats.map(...)
```

This pattern is common in backend development:

```text
Database Model
↓
Transformation
↓
API Response DTO
```

---

## 3. State Transitions Matter

Friend requests are not just records in a database.

They have a lifecycle:

```text
PENDING
↓
ACCEPTED
```

or

```text
PENDING
↓
REJECTED
↓
PENDING
```

Backend logic must correctly handle transitions between states.

---

## 4. Database Constraints Influence Design

The schema contains:

```prisma
@@unique([senderId, receiverId])
```

This prevents multiple friend request rows between the same pair of users.

Because of this constraint, re-sending a rejected request cannot create a new row.

Instead:

```text
REJECTED
↓
PENDING
```

must update the existing record.

This is an example of database constraints shaping business logic.

---

## 5. Common Backend Bug: Forgetting To Return

Handling a special case is not enough.

Example:

```text
Handle REJECTED
↓
Update Request
↓
Return
```

Without returning, execution continues and may trigger unintended logic.

A service should either:

```text
Return
```

or

```text
Throw
```

once a branch has been handled.

---

## 6. Designing Query Logic Around Business Rules

The initial friend request query filtered only:

```text
ACCEPTED
PENDING
```

which made it impossible to detect rejected requests.

The better approach was:

```text
Find Existing Request
↓
Inspect Status
↓
Apply Business Logic
```

rather than filtering away states that still matter to the application.

---

## 7. Chat Discovery Design

A chat list should return information useful to the frontend.

Response shape:

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

instead of exposing raw database fields like:

```text
participant1
participant2
```

which are implementation details.

## 1. Express App vs HTTP Server

Before Socket.IO:

```ts
app.listen(PORT);
```

After Socket.IO:

```ts
const server = http.createServer(app);
server.listen(PORT);
```

Reason:

* Express is a request handler.
* HTTP Server owns the network connection.
* Socket.IO must attach to the HTTP server, not Express.

Architecture:

```text
HTTP Server
├── Express
└── Socket.IO
```

---

## 2. REST and Socket.IO Have Different Responsibilities

REST:

```text
Persistence
Validation
Authorization
Database Operations
```

Socket.IO:

```text
Realtime Delivery
Connection Management
Rooms
Presence
```

We are NOT replacing existing REST endpoints.

Message flow:

```text
POST /messages
↓
Save To Database
↓
Emit Socket Event
↓
Realtime Update
```

Database remains the source of truth.

---

## 3. Socket.IO Authentication

Express middleware:

```ts
(req, res, next)
```

Socket.IO middleware:

```ts
(socket, next)
```

Authentication is performed during the handshake.

Client sends:

```ts
auth: {
    token: jwt
}
```

Server receives:

```ts
socket.handshake.auth.token
```

JWT is verified and user information is attached to the socket:

```ts
(socket as any).user = {
    id,
    email,
    username
}
```

---

## 4. Socket.IO Error Handling

Express:

```ts
throw new ApiError(...)
```

Socket.IO:

```ts
return next(new Error(...))
```

Socket.IO middleware should reject the connection using next(error).

---

## 5. Common Bug Found

JWT payload contained:

```ts
{
    id,
    email,
    username
}
```

but middleware attempted:

```ts
payload.userId
```

Result:

```text
id = undefined
```

Fix:

Use the same property name that was used when signing the JWT.

---

## 6. Testing Socket.IO

Used socket.io-client test script.

Flow:

```text
Client
↓
Connect
↓
Send JWT
↓
Authenticate
↓
Connection Accepted
```

Successfully verified:

```text
JWT reaches server
JWT verifies correctly
User attached to socket
Socket connection established
```
# 2026-06-26

## 1. Socket.IO Rooms Are Dynamic

Rooms do not need to be pre-created.

socket.join(`chat_${chat.id}`)

creates/uses the room automatically.

This allows an application to support any number of chats without hardcoding room names.

---

## 2. for...of vs for...in

Wrong:

for (const chat in chats)

Returns array indexes.

Correct:

for (const chat of chats)

Returns actual chat objects.

This bug surfaced while trying to access chat.id.

---

## 3. Separation of Concerns

Socket authentication:

Verify JWT
Attach user

Room management:

Join user rooms

Message service:

Business logic
Database operations

Controller:

Emit socket events
Return HTTP response

Each layer should have a single responsibility.

---

## 4. Event Name vs Payload

Incorrect mental model:

emit(result.content)

Socket.IO interprets the string as the event name.

Correct mental model:

emit(eventName, payload)

Example:

emit("new_message", result)

Where:

Event Name:
    new_message

Payload:
    created message object

---

## 5. Realtime + REST Work Together

Sockets are not a replacement for fetching history.

Pattern:

GET /messages
    ↓
Load existing messages

socket.on("new_message")
    ↓
Receive future messages

This is the standard architecture used by realtime chat applications.

---

## 6. Frontend and Rooms Are Different Concerns

Server-side:

User joins all chat rooms on connection.

chat_1
chat_5
chat_12

Frontend-side:

When a new message arrives:

if(message.chatId === currentOpenChatId)
    append message to conversation
else
    update chat list
    increment unread count

Room membership is handled by the server.
Message display decisions are handled by the frontend.

---

## 7. End-to-End Realtime Flow

User A sends message
        ↓
Message saved in database
        ↓
Socket event emitted to room
        ↓
Room routes event
        ↓
User B receives event

This was the first complete realtime feature implemented in the project.

# 2026-06-27

## Project Outcome

Built and verified:

- JWT Authentication
- Friend Requests
- Chat Creation
- Messaging
- Socket.IO Authentication
- Socket Rooms
- Realtime Message Delivery
- Prisma Migrations
- Database Indexes

Verified end-to-end flow:

User A
→ Send Request
→ User B Accepts
→ Chat Created
→ Send Message
→ Realtime Delivery

Backend V1 completed successfully.

---

# Technical Learnings

## 1. Architecture Matters More Than Coding

Most implementation became straightforward after deciding:

- Friend request flow
- Chat creation timing
- Database schema
- Room architecture
- API structure

Lesson:

> Spend time designing before coding.

---

## 2. Debugging Is a Skill

Example:

FriendRequest.updatedAt migration issue.

Process:

- Added logs
- Narrowed failure point
- Read stack trace
- Identified schema drift
- Applied migration

Lesson:

> Investigate before asking for help.

---

## 3. Read the Actual Error

Wrong approach:

- Guessing
- Looking only at HTTP 500

Correct approach:

- Read stack trace
- Find exact failing line
- Fix root cause

Lesson:

> The stack trace is usually the fastest path to the solution.

---

## 4. Schema Must Match Database

Problem:

Prisma schema expected:

updatedAt

Database did not contain:

updatedAt

Result:

P2022 error.

Lesson:

> After schema changes, always run migrations and verify database state.

---

## 5. Build First, Optimize Later

Avoided distractions:

- Typing indicators
- Read receipts
- Online presence
- Unread counts
- Attachments

Focused only on MVP.

Lesson:

> Finish the core product before adding extra features.

---

# Personal Learnings

## 1. Finish Things

Completed an entire backend instead of endlessly consuming tutorials.

Lesson:

> Building teaches more than watching.

---

## 2. Think Before Asking

Current habit:

Feature finished
→ Ask "What's next?"

Better habit:

Feature finished
→ Think for 5 minutes
→ Propose next step
→ Ask for review

Lesson:

> Develop architectural thinking, not just implementation skills.

---

## 3. Investigate Further Before Seeking Help

Before asking:

- Add logs
- Read error
- Form hypotheses

Target:

Reach 60-70% of investigation before requesting help.

---

## 4. Confidence Often Lags Behind Skill

Repeated pattern:

"I don't know backend."

Then successfully implementing:

- Transactions
- Authorization
- Realtime messaging
- Socket rooms

Lesson:

> Judge progress by capability, not by confidence.

---

## 5. Engineering Requires Decisions

Many situations do not have a perfect answer.

Better approach:

"This seems reasonable. Let's test it."

Instead of:

"What is the perfect solution?"

Lesson:

> Make decisions and gather evidence.

---

# Improvements For Frontend Phase

When a feature is completed:

Do not immediately ask:

"What's next?"

Instead:

1. Think independently.
2. Propose the next step.
3. Explain your reasoning.
4. Ask for critique.

Example:

"I think we should build routing before pages because multiple pages will need navigation. Am I missing something?"

Goal:

Move from:

"Tell me what to do."

to

"Review my plan."

---

# Key Takeaway

The biggest achievement of Backend V1 was not the code.

It was crossing the line from:

"I study programming."

to

"I can build software."

# 2026-06-28

Frontend Learning

- Created first React + TypeScript project using Vite.
- Learned Vite project creation flow:
  - Framework selection (React)
  - Variant selection (TypeScript)
  - ESLint setup
- Learned basic React Router setup:
  - BrowserRouter
  - Routes
  - Route
- Learned that JSX must be returned from a component.
- Fixed issue where BrowserRouter was not being returned from App component.
- Understood basic frontend architecture:
  - Pages
  - Components
  - Services
  - Socket layer
- Discussed AuthPage architecture and decided to use a Login/Register toggle inside a single AuthPage route.

## 2026-06-29

- Built controlled Login and Register forms using React state.
- Connected frontend forms to the backend through a dedicated auth API layer.
- Learned the child → parent callback pattern (`onRegisterSuccess`) for updating parent state.
- Configured Tailwind CSS for the project and used it for the auth UI.
- Debugged a CORS issue by tracing the request flow from React → Browser → Express instead of guessing.
- Completed my first full frontend authentication flow (React → Axios → Backend → Cookie → Navigation).

# 2026-06-30

### What I Learned

- Planned the chat page by breaking it into reusable components instead of creating one large component.
- Learned why state should eventually be owned by `ChatPage` and passed down as props rather than each component fetching its own data.
- Implemented a proper React modal pattern by passing an `onClose` callback from the parent component.
- Understood event bubbling and why `e.stopPropagation()` prevents the overlay click from firing while not affecting API requests.
- Reinforced that UI structure and functionality should be completed before spending time on visual polish.

# 2025-07-01

## Learning Log - Chat App Frontend Integration

* Replaced guessed frontend interfaces with types that exactly match backend API responses.
* Understood React's data flow by keeping application state in `ChatPage` and passing it to child components through props.
* Learned why callback props such as `onSelectChat` are preferred over directly exposing state setters.
* Converted `ChatList`, `ChatHeader`, `FriendRequestModal`, and `MessageList` from static UI to dynamic components using backend data.
* Practiced using `useEffect` for different scenarios:

  * Fetch chats on component mount.
  * Fetch friend requests on component mount.
  * Fetch messages whenever the selected chat changes.
* Reinforced the idea that components should only receive the data they need instead of managing unrelated state.
* Learned why HTTP-only JWT cookies require a future `/auth/me` endpoint to identify the currently logged-in user on the frontend.
* Improved React architecture by letting the parent component own state while child components communicate through callback props.
