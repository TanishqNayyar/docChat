const express = require('express');
const Document = require('../models/Document');
const { findRelevantChunks } = require('../utils/embeddings');

const router = express.Router();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/', async (req, res) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({ error: 'documentId and question required' });
    }

    // Fetch document from MongoDB
    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    // RAG: find relevant chunks
    const relevantChunks = findRelevantChunks(question, doc.chunks, 3);
    const context = relevantChunks.join('\n\n---\n\n');

    // Build prompt
    const systemPrompt = `You are a helpful document assistant. Answer questions strictly based on the provided document context. If the answer is not in the context, say "I couldn't find that in the document." Be concise and precise.`;

    const userPrompt = `Document context:\n${context}\n\nQuestion: ${question}`;

    // Call Groq API (free, fast)
    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 512,
      }),
    });

    const groqData = await groqRes.json();

    if (!groqRes.ok) {
      console.error('Groq error:', groqData);
      return res.status(500).json({ error: 'Groq API error', detail: groqData });
    }

    const answer = groqData.choices[0].message.content;

    res.json({
      answer,
      chunksUsed: relevantChunks.length,
      documentName: doc.originalName,
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

module.exports = router;
