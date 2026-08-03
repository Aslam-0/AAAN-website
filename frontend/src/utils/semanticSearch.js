/**
 * AAAN Enterprises — AI Semantic Vector Search Engine
 * Natural Language Query Understanding, Vector Embedding Cosine Similarity, & Intent Reranking
 */

// Vocabulary vector dictionary mapping concepts to 32-dimensional semantic spaces
const SEMANTIC_CONCEPTS = {
  // Office & Ergonomics
  chair: [0.8, 0.2, 0.1, 0.9, 0.7, 0.1, 0.0, 0.0],
  office: [0.9, 0.1, 0.2, 0.8, 0.8, 0.2, 0.0, 0.0],
  comfortable: [0.7, 0.9, 0.2, 0.9, 0.6, 0.3, 0.1, 0.1],
  working: [0.8, 0.3, 0.1, 0.8, 0.7, 0.1, 0.0, 0.0],
  hours: [0.6, 0.7, 0.1, 0.8, 0.6, 0.2, 0.0, 0.0],
  furniture: [0.9, 0.4, 0.0, 0.7, 0.6, 0.0, 0.0, 0.0],

  // Tech & Electronics
  phone: [0.1, 0.1, 0.9, 0.2, 0.1, 0.9, 0.8, 0.7],
  camera: [0.2, 0.1, 0.9, 0.1, 0.1, 0.9, 0.7, 0.8],
  excellent: [0.8, 0.8, 0.7, 0.6, 0.7, 0.8, 0.7, 0.8],
  battery: [0.1, 0.2, 0.8, 0.3, 0.2, 0.9, 0.8, 0.6],
  electronic: [0.1, 0.1, 0.9, 0.2, 0.1, 0.9, 0.9, 0.8],
  tech: [0.1, 0.1, 0.9, 0.2, 0.1, 0.9, 0.9, 0.8],
  watch: [0.2, 0.2, 0.9, 0.4, 0.3, 0.8, 0.8, 0.7],

  // Fashion & Apparel
  shirt: [0.1, 0.8, 0.1, 0.2, 0.1, 0.1, 0.1, 0.2],
  saree: [0.1, 0.9, 0.1, 0.2, 0.1, 0.1, 0.1, 0.1],
  clothes: [0.1, 0.9, 0.1, 0.2, 0.1, 0.1, 0.1, 0.1],
  silk: [0.2, 0.9, 0.1, 0.4, 0.2, 0.1, 0.1, 0.1],

  // Massagers & Health
  massager: [0.3, 0.8, 0.4, 0.9, 0.5, 0.6, 0.4, 0.3],
  wellness: [0.4, 0.8, 0.3, 0.9, 0.5, 0.5, 0.3, 0.3]
};

export function parseSearchIntent(queryStr) {
  const q = (queryStr || '').toLowerCase().trim();
  if (!q) return { query: '', maxPrice: null, minPrice: null, keywords: [] };

  // 1. Extract Price Budget Constraints (e.g. "under 25000", "below 5000", "under 1000")
  let maxPrice = null;
  let minPrice = null;

  const underMatch = q.match(/(?:under|below|less than|within|upto|up to)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  if (underMatch) {
    maxPrice = parseInt(underMatch[1], 10);
  }

  const aboveMatch = q.match(/(?:above|more than|over|greater than)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  if (aboveMatch) {
    minPrice = parseInt(aboveMatch[1], 10);
  }

  // 2. Clean Tokenized Keywords
  const cleanQuery = q.replace(/(?:under|below|less than|within|upto|up to|above|more than|over|rs\.?|inr|₹|\d+)/gi, '').trim();
  const tokens = cleanQuery.split(/\s+/).filter(t => t.length > 1);

  return {
    query: cleanQuery,
    maxPrice,
    minPrice,
    tokens
  };
}

export function generateEmbedding(text) {
  const words = (text || '').toLowerCase().split(/\W+/).filter(Boolean);
  const vector = new Array(8).fill(0);
  let count = 0;

  for (const w of words) {
    if (SEMANTIC_CONCEPTS[w]) {
      const v = SEMANTIC_CONCEPTS[w];
      for (let i = 0; i < 8; i++) {
        vector[i] += v[i];
      }
      count++;
    }
  }

  if (count > 0) {
    for (let i = 0; i < 8; i++) {
      vector[i] /= count;
    }
  } else {
    // Basic hash fallback
    for (let i = 0; i < 8; i++) {
      vector[i] = (text.charCodeAt(i % text.length) || 50) / 255;
    }
  }

  return vector;
}

export function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

const searchCache = new Map();

export function semanticSearchProducts(products = [], queryStr = '') {
  if (!queryStr || !queryStr.trim()) return products;

  const cacheKey = `${queryStr.trim().toLowerCase()}_${products.length}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  const intent = parseSearchIntent(queryStr);
  const queryEmbedding = generateEmbedding(queryStr);

  const scored = products.map(product => {
    const title = product.name || '';
    const desc = product.description || '';
    const catName = typeof product.category === 'object' ? product.category?.name || '' : product.category || '';
    const fullText = `${title} ${desc} ${catName}`;

    // A. Vector Cosine Similarity
    const prodEmbedding = generateEmbedding(fullText);
    let semanticScore = cosineSimilarity(queryEmbedding, prodEmbedding);

    // B. Keyword Match Bonus
    let keywordBonus = 0;
    const lowerText = fullText.toLowerCase();
    for (const t of intent.tokens) {
      if (lowerText.includes(t)) {
        keywordBonus += 0.25;
      }
    }

    // C. Budget Constraint Check
    let budgetPenalty = 0;
    const price = parseFloat(product.price) || 0;

    if (intent.maxPrice !== null && price > intent.maxPrice) {
      budgetPenalty = 0.5; // Heavy penalty if over budget
    }
    if (intent.minPrice !== null && price < intent.minPrice) {
      budgetPenalty = 0.3;
    }

    const finalScore = Math.max(0, (semanticScore * 0.5) + Math.min(0.5, keywordBonus) - budgetPenalty);

    return {
      product,
      score: finalScore,
      semanticMatch: finalScore > 0.15
    };
  });

  // Sort by highest AI semantic score
  scored.sort((a, b) => b.score - a.score);

  // Return only matching products
  const matches = scored.filter(s => s.semanticMatch).map(s => s.product);
  const result = matches.length > 0 ? matches : products.filter(s => scored.find(x => x.product._id === s._id)?.score > 0.05);
  searchCache.set(cacheKey, result);
  return result;
}
