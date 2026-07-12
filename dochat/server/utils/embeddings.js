// Split PDF text into overlapping chunks
function chunkText(text, chunkSize = 500, overlap = 50) {
  const words = text.split(/\s+/);
  const chunks = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push(chunk);
    i += chunkSize - overlap;
  }
  return chunks;
}

// Simple keyword-based similarity (no paid embedding API needed)
function cosineSimilarity(query, chunkText) {
  const queryWords = new Set(query.toLowerCase().split(/\s+/));
  const chunkWords = chunkText.toLowerCase().split(/\s+/);
  let matches = 0;
  chunkWords.forEach(w => { if (queryWords.has(w)) matches++; });
  return matches / (queryWords.size + 1);
}

// Find top K most relevant chunks for a query
function findRelevantChunks(query, chunks, topK = 3) {
  const scored = chunks.map((chunk, index) => ({
    text: chunk.text,
    index,
    score: cosineSimilarity(query, chunk.text),
  }));
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(c => c.text);
}

module.exports = { chunkText, findRelevantChunks };
