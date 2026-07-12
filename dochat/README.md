# DocChat — AI Document Intelligence

> Upload any PDF. Ask questions. Get instant answers powered by RAG + Groq Llama 3.

Built with **MongoDB · Express · React · Node.js · Groq API**

---

## How it works (RAG Pipeline)

```
PDF Upload → Text Extraction → Chunking (500 words)
     ↓
Chunks stored in MongoDB
     ↓
User asks a question
     ↓
Relevant chunks retrieved (cosine similarity)
     ↓
Groq Llama 3 answers using only those chunks
```

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/yourusername/dochat
cd dochat

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Environment variables

```bash
cd server
cp .env.example .env
```

Fill in `.env`:
- `MONGO_URI` → Get free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
- `GROQ_API_KEY` → Get free key at [console.groq.com](https://console.groq.com)

### 3. Run locally

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Open `http://localhost:5173`

---

## Deploy on Vercel (Frontend)

```bash
cd client
npm run build
# Deploy /dist folder to Vercel
```

Set environment variable in Vercel:
- `VITE_API_URL` = your backend URL (Railway/Render/etc.)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| AI | Groq API (Llama 3 — free) |
| RAG | Custom chunking + cosine similarity |
| Deployment | Vercel (frontend), Railway (backend) |

---

## Resume bullet point

> Built a RAG-based document Q&A app using MERN stack and Groq's Llama 3 API. Implemented PDF chunking, keyword-based vector retrieval, and context-aware answering — reducing document search time significantly.
