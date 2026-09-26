# Perplexity AI — Full-Stack Technical Architecture

This document outlines the core architecture, data flows, and technical implementation details of the Perplexity AI conversational search engine.

---

## 🏛 System Architecture Overview

```
 [ Client Browser ]
        │
        ├── (REST API) ────► Express 5 Server
        │                          │
        ├── (WebSocket) ───► Socket.IO Server
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
            MongoDB Database              LangChain Engine
            (Users, Chats, Msg)                   │
                                          ┌───────┴───────┐
                                          ▼               ▼
                                   Mistral AI /       Tavily Search
                                   Gemini Fallback    (Live Web)
```

---

## 🔄 End-to-End Search & Generation Workflow

1. **User Query Input**:
   - The user inputs a natural language query in `Dashboard.jsx`.
   - The frontend dispatches an API request to `POST /api/chats/message` (or socket `send_message`).

2. **Automated Title Generation**:
   - If starting a new chat thread, `generateChatTitle(message)` runs.
   - Mistral (`open-mistral-7b`) creates a 3-4 word title; if unavailable, Gemini fallback or local word extraction generates the title immediately.

3. **Tavily Web Retrieval**:
   - LangChain agent invokes the `searchInternet` tool with the formatted query.
   - Tavily queries live indexed websites, extracting relevant text snippets and URLs.

4. **Response Synthesis**:
   - The LLM receives the prompt alongside real-time search context in a `SystemMessage`.
   - Structured answer is synthesized and saved to MongoDB with role `"ai"`.

5. **Client Stream & Render**:
   - The response is emitted via WebSocket or returned in the REST payload.
   - React Markdown parses headings, lists, bold text, and code blocks with syntax highlighting.

---

## 🎨 Strict Monochrome Theme System

The user interface strictly adheres to a minimalist high-contrast monochrome design:

- **Tokens**: `#000000` (Pure Black), `#ffffff` (Pure White), `#1d1d1b`, `#404040`, `#757575`, `#808081`, `#a9a9a9`, `#d6d6d6`.
- **Theme Switcher**: Synchronized across `localStorage` and `document.body` for instant theme toggling without flickering.
- **Universal Loader**: Smooth spinning emblem displayed while authenticating or fetching initial conversation history.

---

## 🔐 Security & Endpoint Protection

- **Cookie-Based JWT**: Signed tokens with HTTP-only cookies prevent XSS credential theft.
- **Email Verification**: Cryptographically secure tokens sent via Nodemailer to verify user identity.
- **API 404 Fallback**: `notFoundFallback` middleware ensures any unknown or unhandled backend route safely returns 404 JSON for APIs or redirects to the dashboard for browser requests.
