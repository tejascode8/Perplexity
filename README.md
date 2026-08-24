# 🔎 Perplexity — AI Search & Chat Application

A full-stack AI-powered chat application inspired by Perplexity, built with **React, Node.js, Express, MongoDB, LangChain, Mistral AI, Tavily, and Socket.IO**.

The application provides authenticated AI conversations, persistent chat history, real-time messaging, and internet-powered AI research.

---

## ✨ Features

- 🔐 User Registration & Login
- ✉️ Email Verification with Nodemailer
- 🔑 JWT Authentication
- 👤 Get Authenticated User
- 💬 AI Chat
- 📚 Persistent Chat History
- 📝 Message Storage
- 🗑️ Delete Chats
- 🤖 Mistral AI Integration
- 🧠 LangChain Integration
- 🌐 Internet Search with Tavily
- ⚡ Real-time Communication with Socket.IO
- 📝 Markdown & GitHub Flavored Markdown Support
- 🎨 React + Tailwind CSS
- 🗃️ Redux Toolkit State Management

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- React Markdown
- Remark GFM

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer
- Socket.IO
- CORS
- Morgan

### AI & Search

- LangChain
- Mistral AI
- Google Generative AI
- Tavily

---

## 📁 Project Structure

```text
perplexity/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── chat.controller.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── chat.model.js
│   │   │   └── message.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── chat.routes.js
│   │   ├── services/
│   │   │   ├── ai.service.js
│   │   │   ├── mail.service.js
│   │   │   └── internet.service.js
│   │   ├── sockets/
│   │   │   └── server.socket.js
│   │   ├── validators/
│   │   │   └── auth.validator.js
│   │   └── app.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── features/
    │   │   ├── auth/
    │   │   └── chat/
    │   └── main.jsx
    ├── package.json
    └── vite.config.js

⚙️ Installation
1. Clone Repository
git clone YOUR_REPOSITORY_URL
cd perplexity

2. Backend
cd backend
npm install
npm run dev

3. Frontend
Open another terminal:

cd frontend
npm install
npm run dev

🔐 Environment Variables
Create .env inside the backend directory:

PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_CLIENT_ID=your_client_id
EMAIL_CLIENT_SECRET=your_client_secret
EMAIL_REFRESH_TOKEN=your_refresh_token

MISTRAL_API_KEY=your_mistral_api_key

GOOGLE_API_KEY=your_google_api_key

TAVILY_API_KEY=your_tavily_api_key

⚠️ Never commit .env or API keys to GitHub.

🔑 Authentication API
Method	Endpoint	Description
POST	/api/auth/register	Register user
GET	/api/auth/verify-email	Verify email
POST	/api/auth/login	Login user
GET	/api/auth/get-me	Get authenticated user

Register
{
  "username": "tejas",
  "email": "tejas@example.com",
  "password": "tejas123"
}

💬 Chat API
Method	Endpoint	Description
POST	/api/chats/message	Create chat / send message
GET	/api/chats/	Get user's chats
GET	/api/chats/:chatId/messages	Get chat messages
DELETE	/api/chats/:chatId	Delete chat

Send Message
{
  "message": "Who are you?"
}

For an existing chat:

{
  "message": "Tell me more about this.",
  "chat": "CHAT_ID"
}

🧠 AI Flow
User
  ↓
React Frontend
  ↓
Express API
  ↓
Chat Controller
  ↓
AI Service
  ↓
Mistral AI + Tavily Search
  ↓
AI Response
  ↓
MongoDB
  ↓
Frontend

Tavily provides internet search capabilities so the AI can research information from the web before generating responses.

🗄️ Database
The application uses MongoDB with three main models:

User
 │
 └── Chat
      │
      └── Message

User
username
email
password
verified

Chat
user
title
createdAt
updatedAt

Message
chat
content
role
createdAt
updatedAt

⚡ Real-Time Communication
Socket.IO is used for real-time communication between frontend and backend.

React
  ↕
Socket.IO
  ↕
Node.js / Express

📚 Main Libraries
Backend
npm install express mongoose jsonwebtoken dotenv cookie-parser
npm install bcryptjs nodemailer cors morgan socket.io
npm install langchain @langchain/mistralai @langchain/google-genai
npm install @tavily/core zod

Frontend
npm install react-router
npm install @reduxjs/toolkit react-redux
npm install axios socket.io-client
npm install react-markdown remark-gfm
npm install tailwindcss @tailwindcss/vite

📖 References
LangChain Documentation
Mistral AI Documentation
Socket.IO Documentation
Tavily
Google AI Studio
Nodemailer Reference Repository
👨‍💻 Author
Tejas Yadav

Built to learn and implement full-stack development, authentication, real-time communication, AI integration, and internet-powered research.

⭐ If you find this project useful, consider giving the repository a star.
