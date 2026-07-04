# Real-Time Chat Application

A full-stack real-time chat application built with React, Express, Socket.IO, and PostgreSQL.

Users can register, log in securely, send friend requests, create chats, and exchange messages in real time.

---

## Live Demo

Frontend:
https://chat-app-nine-zeta-94.vercel.app

Backend API:
https://chat-app-backend-tf8s.onrender.com

---

## Features

### Authentication

- User registration
- User login
- JWT authentication
- HttpOnly cookie-based authentication
- Protected routes

### Friends

- Search users
- Send friend requests
- Accept incoming requests
- Friends list

### Chat

- One-to-one chats
- Real-time messaging using Socket.IO
- Persistent chat history
- Chat ordering based on latest message

### Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- PostgreSQL database hosted on Neon

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- Socket.IO
- JWT
- Cookie Parser
- Zod

### Database

- PostgreSQL (Neon)

### Deployment

- Vercel
- Render

---

## Project Structure

chat-app/

├── chat-app-frontend/

└── chat-app-backend/

---

## Environment Variables

### Backend

```env
DATABASE_URL=

JWT_SECRET=

JWT_EXPIRES_IN=

CLIENT_URL=

PORT=

NODE_ENV=
```

### Frontend

```env
VITE_API_URL=

VITE_SOCKET_URL=
```

---

## Local Setup

### Clone

```bash
git clone <repo-url>
```

### Backend

```bash
cd chat-app-backend

npm install

npm run dev
```

### Frontend

```bash
cd chat-app-frontend

npm install

npm run dev
```

---

## What I Learned

During this project I learned:

- Building a complete authentication system
- Cookie-based JWT authentication
- Socket.IO and real-time communication
- Prisma with PostgreSQL
- Production deployment
- CORS
- Environment variables
- Debugging production issues
- React application architecture
- Express backend architecture

---

## Future Improvements

- Group chats
- Typing indicators
- Online/offline presence
- Read receipts
- Image/file sharing
- Better responsive UI
- Notifications
