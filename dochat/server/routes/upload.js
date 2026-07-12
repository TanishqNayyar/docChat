const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Document = require('../models/Document');
const { chunkText } = require('../utils/embeddings');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });


router.post('/', upload.single('pdf'), async (req, res) => {
  console.log('File received:', req.file?.originalname)
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    console.log('Parsing PDF...')
    const data = await pdfParse(req.file.buffer);
    const rawText = data.text;
    console.log('Parsed! Text length:', rawText?.length)

    if (!rawText || rawText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    const rawChunks = chunkText(rawText, 500, 50);
    const chunks = rawChunks.map((text, index) => ({ text, index }));
    console.log('Chunks created:', chunks.length)

    const doc = await Document.create({
      filename: req.file.originalname,
      originalName: req.file.originalname,
      totalChunks: chunks.length,
      chunks,
    });
    console.log('Saved to MongoDB!')

    res.json({
      success: true,
      documentId: doc._id,
      filename: doc.originalName,
      totalChunks: doc.totalChunks,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});
// Get all documents
router.get('/list', async (req, res) => {
  try {
    const docs = await Document.find({}, 'originalName totalChunks uploadedAt');
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

module.exports = router;
