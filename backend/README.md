# Perplexity AI — Backend Service

A high-throughput Node.js + Express 5 backend providing real-time AI reasoning, multi-tiered search fallback, MongoDB conversation persistence, and secure tokenized authentication.

---

## 🏗 Architecture & Core Modules

- **AI Orchestration (`src/services/ai.service.js`)**:
  - LangChain agent integration with Mistral AI (`open-mistral-7b`) as primary reasoning model.
  - Live Tavily search integration as a dynamic tool (`searchInternet`).
  - Google Gemini (`gemini-1.5-flash-latest`) fallback engine.
  - Automated local prompt-based title extraction.
- **WebSocket Streaming (`src/sockets/server.socket.js`)**:
  - Socket.IO connection layer handling instant message delivery and room management.
- **Authentication & Security (`src/controllers/auth.controller.js` & `src/middlewares/`)**:
  - Encrypted password hashing with `bcryptjs`.
  - JWT generation stored in HTTP-only, secure cookies.
  - Nodemailer verification email dispatching.
  - Automatic 404 fallback middleware preventing exposure of unhandled endpoints.

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env` and provide your credentials:
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/perplexity?retryWrites=true&w=majority
JWT_SECRET_KEY=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173

# AI & Search Providers
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=open-mistral-7b
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash-latest
TAVILY_API_KEY=your_tavily_api_key_here

# Nodemailer Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### Running Locally
```bash
# Development mode with live nodemon reload
npm run dev

# Run unit / integration tests
npm test
```

---

## 📡 REST API Reference

### Auth Endpoints (`/api/auth`)
- `POST /api/auth/register` — Create account and send verification email.
- `POST /api/auth/login` — Validate credentials and set auth cookie.
- `GET /api/auth/get-me` — Retrieve active user session.
- `POST /api/auth/logout` — Expire session cookie.
- `GET /api/auth/verify-email` — Validate email verification token.

### Chat Endpoints (`/api/chats`)
- `GET /api/chats` — Fetch all chat threads for the authenticated user.
- `POST /api/chats/message` — Send a query, execute web search, and generate response.
- `GET /api/chats/:id/messages` — Fetch message history for a specific chat.
- `DELETE /api/chats/:id` — Remove a chat thread and all related messages.

---

## 🔌 Socket.IO Events

| Event | Direction | Description |
| :--- | :--- | :--- |
| `join_chat` | Client &rarr; Server | Joins the specified `chatId` room |
| `send_message` | Client &rarr; Server | Dispatches a new user message |
| `receive_message` | Server &rarr; Client | Emits synthesized AI output to the room |
