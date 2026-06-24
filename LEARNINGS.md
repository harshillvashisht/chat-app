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
