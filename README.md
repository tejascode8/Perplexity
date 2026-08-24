# 🔎 Perplexity — AI Search & Chat Application

Perplexity is a full-stack AI-powered chat application inspired by modern AI search assistants.

The project combines **React, Redux, Node.js, Express, MongoDB, Socket.IO, LangChain, Mistral AI, and Tavily** to provide authenticated conversations, persistent chat history, AI-generated responses, and internet-powered research.

---

## 🚀 Project Status

This project was developed incrementally through multiple implementation stages.

### Current Features

- 🔐 User registration & authentication
- ✉️ Email verification with Nodemailer
- 🔑 JWT-based authentication
- 👤 Authenticated user profile / Get Me
- 💬 Real-time AI chat
- 📚 Persistent chat history
- 📝 Persistent message storage
- 🗑️ Chat deletion
- 🤖 Mistral AI integration
- 🧠 LangChain integration
- 🌐 Internet research using Tavily
- 🔌 Real-time communication using Socket.IO
- 📝 Markdown rendering for AI responses
- 📊 GitHub Flavored Markdown support
- 🎨 React + Tailwind CSS frontend
- 🗃️ Redux Toolkit state management
- 🛡️ Input validation with Joi and Zod

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- React Router
- Redux Toolkit
- React Redux
- Axios
- Tailwind CSS
- Socket.IO Client
- React Markdown
- Remark GFM

## Backend

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

## AI & Search

- LangChain
- Mistral AI
- Google Gemini / Google Generative AI
- Tavily Internet Search

## Validation

- Joi
- Zod

---

# 📋 Project Overview

The application consists of two major parts:

```text
Perplexity
│
├── backend/
│   └── Node.js + Express + MongoDB
│
└── frontend/
    └── React + Vite + Redux + Tailwind CSS

The backend provides authentication, database management, AI processing, internet search, email verification, and real-time communication.

The frontend provides the user interface for authentication, conversations, chat history, and AI responses.

📁 Project Structure
Backend
backend/
│
├── src/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── chat.controller.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── chat.model.js
│   │   └── message.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── chat.routes.js
│   │
│   ├── services/
│   │   ├── ai.service.js
│   │   ├── mail.service.js
│   │   └── internet.service.js
│   │
│   ├── sockets/
│   │   └── server.socket.js
│   │
│   ├── validators/
│   │   └── auth.validator.js
│   │
│   └── app.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js

📁 Frontend
frontend/
│
├── public/
│   └── perplexity-icon.png
│
├── src/
│   │
│   ├── app/
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   ├── app.store.js
│   │   └── index.css
│   │
│   ├── features/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.slice.js
│   │   │   ├── components/
│   │   │   │   └── Protected.jsx
│   │   │   ├── hook/
│   │   │   │   └── useAuth.js
│   │   │   ├── pages/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   └── service/
│   │   │       └── auth.api.js
│   │   │
│   │   └── chat/
│   │       ├── pages/
│   │       │   └── Dashboard.jsx
│   │       ├── hooks/
│   │       │   └── useChat.js
│   │       ├── services/
│   │       │   ├── chat.socket.js
│   │       │   ├── chat.api.js
│   │       │   └── internet.service.js
│   │       └── chat.slice.js
│   │
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js

⚙️ Installation & Setup
Prerequisites
Make sure you have the following installed:

Node.js
npm
MongoDB Atlas account or local MongoDB
Git
You will also need API credentials for the services used by the application.

📦 Backend Installation
Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Start the development server:

npm run dev

Start production server:

npm start

🎨 Frontend Installation
Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the Vite development server:

npm run dev

🔐 Environment Variables
Create a .env file inside the backend directory.

Example:

PORT=3000

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/perplexity

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_CLIENT_ID=your_google_client_id
EMAIL_CLIENT_SECRET=your_google_client_secret
EMAIL_REFRESH_TOKEN=your_google_refresh_token

MISTRAL_API_KEY=your_mistral_api_key

GOOGLE_API_KEY=your_google_api_key

TAVILY_API_KEY=your_tavily_api_key

⚠️ Never commit your .env file or API keys to GitHub.

Add .env to .gitignore:

node_modules
.env

▶️ Start the Project
From the project root, start the backend and frontend separately.

Backend
cd backend
npm run dev

Frontend
cd frontend
npm run dev

The backend runs on:

http://localhost:3000

The frontend Vite development URL will be displayed in your terminal.

🔐 Authentication System
The application implements a complete authentication flow.

Register
   ↓
Validate Input
   ↓
Create User
   ↓
Hash Password
   ↓
Send Verification Email
   ↓
Verify Email
   ↓
Login
   ↓
Generate JWT
   ↓
Authenticated Requests

Authentication Features
User registration
Username validation
Email validation
Password hashing
Email verification
JWT authentication
Protected routes
Authenticated user retrieval
Login restrictions for unverified users
🔑 Authentication API
Register
POST /api/auth/register

Request:

{
  "username": "tejas",
  "email": "tejas@example.com",
  "password": "tejas123"
}

The server:

Validates the input
Checks username/email uniqueness
Hashes the password
Creates the user
Generates verification information
Sends a verification email
Login
POST /api/auth/login

Request:

{
  "email": "tejas@example.com",
  "password": "tejas123"
}

The user can log in only after email verification.

Get Current User
GET /api/auth/get-me

Returns authenticated user information.

This endpoint requires JWT authentication.

Verify Email
GET /api/auth/verify-email

The verification token is provided through the email verification link.

🔌 Authentication Endpoints Summary
Endpoint	Method	Description
/	GET	Server health check
/api/auth/register	POST	Register a new user
/api/auth/verify-email	GET	Verify user email
/api/auth/login	POST	Login verified user
/api/auth/get-me	GET	Get authenticated user

💬 Chat System
The chat system allows authenticated users to:

Create new conversations
Send messages
Continue existing conversations
Store messages
Retrieve chat history
Delete conversations
Receive AI-generated responses
💬 Chat API
Create New Chat
POST /api/chats/message

Request:

{
  "message": "Hello, how are you?"
}

If a chat ID is not supplied, a new chat is created.

Send Message to Existing Chat
POST /api/chats/message

Request:

{
  "message": "Who are you?",
  "chat": "CHAT_ID"
}

Get All User Chats
GET /api/chats/

Returns all chats belonging to the authenticated user.

Get Chat Messages
GET /api/chats/:chatId/messages

Returns all messages associated with a chat.

Delete Chat
DELETE /api/chats/:chatId

Deletes the selected conversation.

🗄️ Database Design
The application uses MongoDB with Mongoose.

User
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String,
  verified: Boolean,
  createdAt: Date,
  updatedAt: Date
}

Important properties:

username — unique username
email — unique email
password — securely hashed
verified — email verification status
Chat
{
  _id: ObjectId,
  user: ObjectId,
  title: String,
  createdAt: Date,
  updatedAt: Date
}

Each chat belongs to a user.

Message
{
  _id: ObjectId,
  chat: ObjectId,
  content: String,
  role: String,
  createdAt: Date,
  updatedAt: Date
}

Message roles:

user
ai

🔗 Database Relationships
User
 │
 │ 1
 │
 └───────────────┐
                 │ N
                Chat
                 │
                 │ 1
                 │
                 └───────────────┐
                                 │ N
                              Message

In short:

User (1) ──── (N) Chat (1) ──── (N) Message

🤖 AI Integration
The application uses LangChain to communicate with AI chat models.

The AI layer is responsible for:

Processing user messages
Generating AI responses
Generating chat titles
Maintaining conversational context
Integrating external tools
Performing internet research
🧠 LangChain
LangChain provides an abstraction layer for working with different AI models and tools.

It allows the application to:

Connect to different LLM providers
Create prompts
Manage conversational workflows
Connect AI models with tools
Build more complex AI pipelines
Packages used include:

npm install langchain

and:

npm install @langchain/google-genai

For Mistral:

npm install @langchain/mistralai

🌐 Internet Research with Tavily
The application integrates Tavily to provide internet search capabilities.

Tavily allows the AI system to retrieve information from the web and use that information when generating responses.

The integration contains:

User Question
      ↓
AI Service
      ↓
Determine whether web research is required
      ↓
Tavily Search
      ↓
Search Results
      ↓
AI Processing
      ↓
Final Response

Backend service:

src/services/internet.service.js

Required environment variable:

TAVILY_API_KEY=your_tavily_api_key

📝 Markdown Support
AI responses can contain Markdown formatting.

The frontend uses:

npm install react-markdown

for rendering Markdown.

GitHub Flavored Markdown is enabled with:

npm install remark-gfm

This allows the application to render:

Headings
Lists
Tables
Code blocks
Links
Bold text
Italic text
Strikethrough
Task lists
⚡ Real-Time Communication
The application uses Socket.IO for real-time communication.

Backend
npm install socket.io

Socket server:

src/sockets/server.socket.js

Frontend
npm install socket.io-client

Socket client:

src/features/chat/services/chat.socket.js

The real-time architecture allows the frontend and backend to communicate through Socket.IO events.

React Client
     │
     │ Socket.IO
     ↓
Node.js Server
     │
     ↓
Chat / AI Services

📧 Email Verification
Email verification is implemented using Nodemailer.

The mail service is responsible for:

Creating the email transporter
Configuring Gmail OAuth2
Generating verification links
Sending verification emails
Verifying email delivery configuration
Service:

src/services/mail.service.js

The implementation was inspired by the Nodemailer implementation from Ankur's Difference Backend Video repository.

Reference:

Difference Backend Video — Ankur's GitHub Repository

🛡️ Validation
Authentication input is validated before reaching the controller.

The project uses Joi for authentication validation.

Example validation requirements:

Username
├── Required
├── 3–30 characters
└── Alphanumeric + underscore

Email
└── Valid email format

Password
└── Minimum 6 characters

Zod is also used for structured validation in the internet/AI tool workflow.

🧩 Backend Architecture
The backend follows a layered architecture.

Request
  ↓
Routes
  ↓
Middleware
  ↓
Validators
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
MongoDB

Routes
Responsible for defining API endpoints.

src/routes/

Middleware
Responsible for processing requests before controllers.

src/middlewares/

Controllers
Responsible for application/business logic.

src/controllers/

Services
Responsible for external integrations and reusable business services.

src/services/

Models
Responsible for MongoDB schemas.

src/models/

🎨 Frontend Architecture
The frontend follows a feature-based structure.

src/
│
├── app/
│
├── features/
│   ├── auth/
│   └── chat/
│
└── main.jsx

The features directory separates application functionality into independent modules.

🔐 Auth Feature
features/auth/
│
├── auth.slice.js
├── components/
│   └── Protected.jsx
├── hook/
│   └── useAuth.js
├── pages/
│   ├── Login.jsx
│   └── Register.jsx
└── service/
    └── auth.api.js

Responsibilities:

Login
Registration
Authentication state
Protected routes
User information
Authentication API requests
💬 Chat Feature
features/chat/
│
├── chat.slice.js
│
├── hooks/
│   └── useChat.js
│
├── pages/
│   └── Dashboard.jsx
│
└── services/
    ├── chat.api.js
    ├── chat.socket.js
    └── internet.service.js

Responsibilities:

Chat state
Messages
Chat history
Chat creation
Chat deletion
API communication
Socket communication
AI response rendering
🗃️ Redux State Management
Redux Toolkit manages global application state.

The application contains separate slices for major features.

Redux Store
│
├── auth
│   └── Authentication state
│
└── chat
    ├── Chats
    ├── Messages
    ├── Loading
    └── Errors

Store configuration:

src/app/app.store.js

🔄 Complete Chat Flow
User
 │
 │ Sends message
 ↓
React Dashboard
 │
 ↓
useChat()
 │
 ↓
Redux / API
 │
 ↓
Express Chat Route
 │
 ↓
Chat Controller
 │
 ├── Create / Find Chat
 │
 ├── Save User Message
 │
 ↓
AI Service
 │
 ├── Mistral AI
 │
 └── Tavily Internet Search
 │
 ↓
AI Response
 │
 ↓
Save AI Message
 │
 ↓
Socket.IO
 │
 ↓
React Frontend
 │
 ↓
React Markdown
 │
 ↓
Rendered Response

🏗️ Development Timeline
Part 1 — Backend Foundation
Implemented:

Express server
MongoDB connection
Mongoose models
Authentication foundation
JWT
Password hashing
Nodemailer
Input validation
Authentication routes
Main dependencies:

npm i express mongoose jsonwebtoken dotenv cookie-parser
npm i bcryptjs nodemailer
npm i -D nodemon

Part 2 — Authentication + Generative AI
Implemented:

Email verification
Login
Get Me
JWT authentication middleware
Google Generative AI integration
LangChain
Dependencies:

npm install langchain
npm install @langchain/google-genai

Part 3 — AI + Tools + Email
Expanded the AI architecture to support:

Chat models
External tools
Email services
AI-powered workflows
Part 4 — Frontend + Real-Time Communication
Implemented:

React frontend
Vite
Redux Toolkit
React Router
Tailwind CSS
Axios
Socket.IO
CORS
Morgan
Backend Socket.IO server
Frontend dependencies:

npm install tailwindcss @tailwindcss/vite
npm install react-router
npm install @reduxjs/toolkit react-redux
npm install axios
npm install socket.io-client

Backend dependencies:

npm install cors
npm install morgan
npm install socket.io

Part 5 — Chat System + Mistral AI
Implemented:

Chat creation
Chat titles
Message storage
Existing chat messages
Chat deletion
Mistral AI integration
AI-generated responses
Dependency:

npm install @langchain/mistralai

Part 6 — Redux Chat Management
Implemented:

Chat Redux slice
Chat API service
Chat hook
Message state management
Chat list
Loading states
Error handling
Markdown rendering
Dependency:

npm install react-markdown

Part 7 — Internet Search
Implemented:

Tavily API
Internet search service
AI + search integration
Improved chat handling
GitHub Flavored Markdown
Tables
Task lists
Strikethrough
Improved message formatting
Dependencies:

npm install @tavily/core
npm install zod
npm install remark-gfm

📦 Important Dependencies
Backend
express
mongoose
jsonwebtoken
bcryptjs
dotenv
cookie-parser
nodemailer
cors
morgan
socket.io
langchain
@langchain/google-genai
@langchain/mistralai
@tavily/core
zod

Frontend
react
vite
react-router
@reduxjs/toolkit
react-redux
axios
socket.io-client
react-markdown
remark-gfm
tailwindcss
@tailwindcss/vite

🔗 External Services
The project uses the following external services:

MongoDB — Database
Mistral AI — AI chat model
Google AI / Gemini — Generative AI experimentation/integration
Tavily — Internet search
Gmail / Nodemailer — Email verification
Socket.IO — Real-time communication
🔒 Security Considerations
The project includes several security mechanisms:

Password hashing with bcrypt
JWT authentication
Protected API endpoints
Email verification
Environment variables for secrets
Input validation
CORS configuration
User-specific chat ownership
Never expose secrets
Do not commit:

.env
API keys
JWT secrets
OAuth credentials
MongoDB credentials

🧪 API Testing
You can test the backend using tools such as:

Postman
Insomnia
Thunder Client
cURL
Example:

curl http://localhost:3000/

Expected response:

{
  "message": "Server is up and running"
}

🚀 Quick Start
Clone the repository:

git clone YOUR_REPOSITORY_URL

Navigate into the project:

cd perplexity

Install backend dependencies:

cd backend
npm install

Configure:

backend/.env

Start backend:

npm run dev

Open another terminal and install frontend dependencies:

cd frontend
npm install

Start frontend:

npm run dev

📌 Main Application Flow
                    ┌──────────────┐
                    │    User      │
                    └──────┬───────┘
                           │
                           ↓
                    ┌──────────────┐
                    │    React     │
                    │   Frontend   │
                    └──────┬───────┘
                           │
                  HTTP / Socket.IO
                           │
                           ↓
                    ┌──────────────┐
                    │   Express    │
                    │    Server    │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
          Auth API     Chat API     Socket.IO
              │            │
              ↓            ↓
          MongoDB      AI Service
                           │
                    ┌──────┴──────┐
                    ↓             ↓
                Mistral AI      Tavily
                    │             │
                    └──────┬──────┘
                           ↓
                    AI Response
                           │
                           ↓
                       MongoDB
                           │
                           ↓
                     Frontend UI

