# Spur AI Backend

This is the backend server for **Spur AI Chat Widget**, built with **Node.js, Express, TypeScript, and MongoDB**.  
It provides APIs for handling AI chat messages, persisting conversations, and generating AI replies using an LLM.

---

## **Tech Stack**

- Node.js + TypeScript
- Express.js
- MongoDB + Mongoose
- OpenAI (or other LLM)
- dotenv for environment variables
- uuid for session management
- cors, cookie-parser

---

## **Features**

- POST `/api/chat/message` – send user message & get AI reply
- GET `/api/chat/history/:sessionId` – fetch previous conversation
- Persist conversation & messages in MongoDB
- Session persistence using `sessionId`
- AI integration with conversation context & summarization
- Graceful error handling & fallback
- CORS configured for frontend connectivity

---

## **Environment Variables**

Create a `.env` file:

```env
PORT=8000
MONGODB_URI=<your-mongodb-uri>
OPENAI_API_KEY=<your-openai-api-key>
CORS_ORIGIN=http://localhost:5173


backend/
│
├── controllers/        # API controllers
├── db/                 # MongoDB connection
├── middlewares/        # Error handling, validation
├── models/             # Mongoose models
├── routes/             # Express routes
├── services/           # LLM integration & helpers
├── utils/              # Async handler, API response/errors
├── app.js              # Express app setup
└── index.js            # Server entry point
