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
