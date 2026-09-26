<<<<<<< HEAD
# Perplexity AI — Full-Stack Conversational Search Engine

A high-performance AI-powered conversational search platform inspired by Perplexity AI. Combines live internet search retrieval via Tavily with frontier Large Language Models (Mistral AI & Google Gemini) to deliver precise, structured, and cited answers in real-time.

---

## 📑 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Key Features](#-key-features)
- [Design System & Palette](#-design-system--palette)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [WebSocket Events](#-websocket-events)

---

## 🏛 Architecture Overview

```
                     ┌───────────────────────────────────────┐
                     │          React + Vite Client          │
                     │  (Tailwind CSS, Redux Toolkit, Theme) │
                     └──────────────────┬────────────────────┘
                                        │ HTTP / REST & WebSockets
                                        ▼
                     ┌───────────────────────────────────────┐
                     │          Node.js Express API          │
                     │    (Auth, Middleware, Rate Limiting)  │
                     └───────┬──────────────────────┬────────┘
                             │                      │
                 ┌───────────▼──────────┐   ┌───────▼───────────┐
                 │    MongoDB Database  │   │  LangChain Engine │
                 │  (Users, Chats, Msg) │   └───────┬───────────┘
                 └──────────────────────┘           │
                                    ┌───────────────┴───────────────┐
                                    ▼                               ▼
                      ┌───────────────────────────┐   ┌───────────────────────────┐
                      │    Mistral AI / Gemini    │   │     Tavily Web Search     │
                      │  (Reasoning & Generation) │   │   (Real-Time Web Index)   │
                      └───────────────────────────┘   └───────────────────────────┘
```

---

## ✨ Key Features

- **Live Internet Retrieval**: Grounded answers fetched via Tavily Web Search tool in real-time.
- **Multi-Tier AI Fallback**: Primary agent execution with Mistral AI, seamless fallback to Google Gemini, and automated local extraction for resilience.
- **Universal Monochrome Design**: Meticulously designed minimalist UI supporting dynamic Dark and Light modes with strict high-contrast compliance.
- **Universal Page Loader**: Responsive loading state with rotating emblem that remains active until sessions and data are fully resolved.
- **Real-Time WebSockets**: Instant bidirectional chat communication powered by Socket.IO.
- **Rich Markdown & Code Rendering**: GitHub-flavored Markdown rendering with syntax-highlighted code blocks and single-click copy feedback.
- **Secure Authentication**: JWT-based authentication stored in HTTP-only cookies with email verification workflows.
- **API Endpoint Protection**: Automatic 404 middleware that secures API endpoints and redirects unhandled navigation to the dashboard.

---

## 🎨 Design System & Palette

The platform follows a strict monochrome visual hierarchy designed for readability and focus:

| Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Pure Black** | `#000000` | Dark mode base background, primary light mode text |
| **Pure White** | `#ffffff` | Light mode base background, primary dark mode text |
| **Dark Charcoal** | `#1d1d1b` | Dark mode surface & card background |
| **Medium Gray** | `#404040` | Dark mode borders, elevated surfaces |
| **Neutral Gray** | `#757575` | Secondary text in light mode |
| **Mid Gray** | `#808081` | Accent elements and subtle icons |
| **Light Gray** | `#a9a9a9` | Secondary text in dark mode |
| **Soft Gray** | `#d6d6d6` | Light mode borders, chips, and subtle dividers |

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **State Management**: Redux Toolkit + React-Redux
- **Routing**: React Router v7
- **Styling**: Tailwind CSS + Custom CSS Variables & Animations
- **Markdown**: `react-markdown` + `remark-gfm` + `highlight.js`
- **Real-time Client**: `socket.io-client`

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose ODM
- **AI Orchestration**: LangChain (`@langchain/mistralai`, `@langchain/google-genai`, `@langchain/core`)
- **Web Search**: `@tavily/core`
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs` + `cookie-parser`
- **Email Service**: Nodemailer
- **Validation**: Express-Validator + Zod

---

## 📂 Project Directory Structure

```
Perplexity/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & mailer configurations
│   │   ├── controllers/     # Auth and chat request controllers
│   │   ├── middlewares/     # Auth checks, error handling, 404 fallback
│   │   ├── models/          # Mongoose schemas (User, Chat, Message)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # AI orchestration, Tavily search, email service
│   │   ├── sockets/         # Socket.io connection handlers
│   │   └── validators/      # Request payload validation schemas
│   ├── .env.example
│   ├── package.json
│   └── server.js            # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Router, theme context, global components
│   │   ├── features/
│   │   │   ├── auth/        # Auth slices, hooks, Login & Register pages
│   │   │   └── chat/        # Chat slices, hooks, Dashboard, CodeBlock
│   │   └── main.jsx         # Application root mount
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- API Keys:
  - [Mistral AI API Key](https://console.mistral.ai/)
  - [Google Gemini API Key](https://aistudio.google.com/)
  - [Tavily Search API Key](https://tavily.com/)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000`.

---

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure frontend environment in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
| :--- | :--- |
| `PORT` | Server listening port (default: `3000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET_KEY` | Secret key for signing JSON Web Tokens |
| `FRONTEND_URL` | Frontend URL for CORS configuration (`http://localhost:5173`) |
| `MISTRAL_API_KEY` | Mistral AI API key |
| `MISTRAL_MODEL` | Mistral model identifier (default: `open-mistral-7b`) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Gemini model identifier (default: `gemini-1.5-flash-latest`) |
| `TAVILY_API_KEY` | Tavily Web Search API key |
| `EMAIL_USER` | SMTP username for verification emails |
| `EMAIL_PASS` | SMTP password / app key |

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT cookie |
| `GET` | `/api/auth/get-me` | Retrieve authenticated user profile |
| `POST` | `/api/auth/logout` | Clear authentication cookie |
| `GET` | `/api/auth/verify-email` | Verify user registration email |

### Conversations (`/api/chats`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/chats` | Retrieve all chat chats for the current user |
| `POST` | `/api/chats/message` | Submit prompt, trigger web search + LLM reasoning |
| `GET` | `/api/chats/:id/messages`| Retrieve all messages within a specific chats |
| `DELETE` | `/api/chats/:id` | Delete a chats and all associated messages |

---

## ⚡ WebSocket Events

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join_chat` | Client &rarr; Server | `{ chatId }` | Joins a chat room |
| `send_message` | Client &rarr; Server | `{ message, chatId }` | Submits message over socket |
| `receive_message` | Server &rarr; Client | `{ content, role, chatId }`| Delivers synthesized AI answer |

---

## 📄 License
This project is open source and available under the [ISC License](LICENSE).
=======
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
>>>>>>> a41694a68fa00499ea0efd1a9fdf708ce6940e7e
