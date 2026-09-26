# Perplexity AI — Full-Stack Conversational Search Engine

A modern, high-performance AI-powered conversational search platform inspired by Perplexity AI. Combines live internet search retrieval via Tavily with frontier Large Language Models (Mistral AI & Google Gemini) to deliver precise, structured, and cited answers in real-time.

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
- [Documentation & Guides](#-documentation--guides)

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
│   ├── README.md
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
│   ├── README.md
│   └── vite.config.js
│
├── Documents/
│   ├── ARCHITECTURE.md      # Detailed architectural walkthrough
│   └── documentation.txt
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

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Server listening port | `3000` |
| `MONGO_URI` | MongoDB connection string | — |
| `JWT_SECRET_KEY` | Secret key for signing JSON Web Tokens | — |
| `FRONTEND_URL` | Frontend origin for CORS policy | `http://localhost:5173` |
| `MISTRAL_API_KEY` | Mistral AI API key | — |
| `MISTRAL_MODEL` | Mistral model identifier | `open-mistral-7b` |
| `GEMINI_API_KEY` | Google Gemini API key | — |
| `GEMINI_MODEL` | Gemini model identifier | `gemini-1.5-flash-latest` |
| `TAVILY_API_KEY` | Tavily Web Search API key | — |
| `EMAIL_USER` | SMTP username for verification emails | — |
| `EMAIL_PASS` | SMTP password / app key | — |

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
| `GET` | `/api/chats` | Retrieve all chats for the current user |
| `POST` | `/api/chats/message` | Submit prompt, trigger web search + LLM reasoning |
| `GET` | `/api/chats/:id/messages`| Retrieve all messages within a specific chat |
| `DELETE` | `/api/chats/:id` | Delete a chat and all associated messages |

---

## ⚡ WebSocket Events

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join_chat` | Client &rarr; Server | `{ chatId }` | Joins a chat room |
| `send_message` | Client &rarr; Server | `{ message, chatId }` | Submits message over socket |
| `receive_message` | Server &rarr; Client | `{ content, role, chatId }`| Delivers synthesized AI answer |

---

## 📚 Documentation & Guides

- [Architecture & Flow Guide](Documents/ARCHITECTURE.md)
- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)

---

## 📄 License
This project is open source and available under the [ISC License](LICENSE).
