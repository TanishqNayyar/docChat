const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  text: String,
  index: Number,
  embedding: [Number], // vector stored as array of floats
});

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  totalChunks: Number,
  chunks: [chunkSchema],
});

module.exports = mongoose.model('Document', documentSchema);
