# Learning Notes

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
