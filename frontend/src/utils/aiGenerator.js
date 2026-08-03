/**
 * AAAN Enterprises — High-Speed AI Product Description & SEO Generator Engine
 * Fast Models: Gemini 1.5 Flash, Llama 3 8B / GPT-3.5 Turbo (OpenRouter), & Mistral 7B (Hugging Face)
 * Features Automatic Failover Pipeline for Sub-Second Responses!
 */

const aiResponseCache = new Map();

export async function generateProductContent({
  productName,
  features,
  specifications,
  provider = 'gemini',
  apiKey = ''
}) {
  const cacheKey = `${productName}_${features}_${specifications}`.toLowerCase();
  if (aiResponseCache.has(cacheKey)) {
    return aiResponseCache.get(cacheKey);
  }
  const prompt = `You are an expert e-commerce copywriter & SEO specialist for AAAN Enterprises.
Given the following product details:
Product Name: ${productName}
Key Features: ${features}
Technical Specifications: ${specifications}

Generate a complete JSON response containing:
1. "professionalDescription": A 2-paragraph engaging, persuasive, luxury product description.
2. "bulletPoints": An array of 4-5 high-converting bullet points.
3. "seoTitle": A click-worthy, SEO-optimized title (under 60 characters).
4. "metaDescription": A compelling search meta description (under 155 characters).
5. "keywords": An array of 6-8 relevant search keywords/phrases.
6. "faqs": An array of 3 objects with "question" and "answer".

Respond ONLY with valid, raw JSON with no markdown block headers.`;

  const geminiKey = (apiKey || '').trim() || import.meta.env.VITE_GEMINI_API_KEY || '';
  const openrouterKey = (apiKey || '').trim() || import.meta.env.VITE_OPENROUTER_API_KEY || '';
  const huggingfaceKey = (apiKey || '').trim() || import.meta.env.VITE_HUGGINGFACE_API_KEY || '';

  // Order of execution based on user selection + failover
  const providersToTry = [provider];
  if (!providersToTry.includes('gemini')) providersToTry.push('gemini');
  if (!providersToTry.includes('openrouter')) providersToTry.push('openrouter');
  if (!providersToTry.includes('huggingface')) providersToTry.push('huggingface');

  for (const currentProvider of providersToTry) {
    
    // 1. Google Gemini 1.5 Flash (Ultra Fast Low Latency)
    if (currentProvider === 'gemini' && geminiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          aiResponseCache.set(cacheKey, parsed);
          return parsed;
        }
      } catch (e) {
        console.warn("Gemini 1.5 Flash failed, trying next provider:", e);
      }
    }

    // 2. OpenRouter Fast Model (Llama 3 8B / GPT-3.5 Turbo)
    if (currentProvider === 'openrouter' && openrouterKey) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openrouterKey}`,
            'HTTP-Referer': 'https://aaanenterprises.com',
            'X-Title': 'AAAN AI Studio',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3-8b-instruct:free',
            messages: [{ role: 'user', content: prompt }]
          })
        });
        const data = await res.json();
        const rawText = data.choices?.[0]?.message?.content;
        if (rawText) {
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          aiResponseCache.set(cacheKey, parsed);
          return parsed;
        }
      } catch (e) {
        console.warn("OpenRouter API call failed, trying next provider:", e);
      }
    }

    // 3. Hugging Face Inference API (Mistral 7B / Llama 3)
    if (currentProvider === 'huggingface' && huggingfaceKey) {
      try {
        const res = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${huggingfaceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: prompt })
        });
        const data = await res.json();
        const rawText = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
        if (rawText) {
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            aiResponseCache.set(cacheKey, parsed);
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Hugging Face API call failed:", e);
      }
    }

  }

  // 4. Instant Local Smart Engine (Zero-latency fallback)
  return generateSmartFallback({ productName, features, specifications });
}

function generateSmartFallback({ productName, features, specifications }) {
  const featList = features
    ? features.split(/,|\n/).map(f => f.trim()).filter(Boolean)
    : ['High build quality', 'Ergonomic design', 'Premium finish'];

  const name = productName || 'AAAN Executive Product';

  return {
    professionalDescription: `Elevate your lifestyle with the all-new ${name} from AAAN Enterprises. Designed for discerning customers who demand superior craftsmanship, this product combines cutting-edge performance with elegant aesthetics. Whether for daily personal use or professional deployment, ${name} delivers unrivaled reliability and convenience.\n\nBuilt using grade-A materials and engineered for longevity, ${name} undergoes rigorous quality testing to ensure complete customer satisfaction. Experience premium craftsmanship and enjoy fast express delivery with AAAN Enterprises.`,
    bulletPoints: [
      `✨ Premium Build Quality: Crafted with high-durability materials for long-lasting performance.`,
      `🚀 ${featList[0] || 'Advanced Features'}: Engineered for maximum efficiency and seamless daily operation.`,
      `🛡️ AAAN Quality Guarantee: 100% genuine product backed by official manufacturer warranty.`,
      `🚚 Express Fulfillment: Carefully packaged and shipped via fast express delivery across India.`,
      `👌 ${featList[1] || 'User-Friendly Design'}: Intuitive, effortless operation tailored for modern comfort.`
    ],
    seoTitle: `Buy ${name} Online — Best Price | AAAN Enterprises`,
    metaDescription: `Shop ${name} online at AAAN Enterprises. Enjoy genuine quality, ${featList[0] || 'premium features'}, fast shipping & 30-day easy returns.`,
    keywords: [
      name.toLowerCase(),
      `buy ${name.toLowerCase()}`,
      `best ${name.toLowerCase()} price`,
      `aaan enterprises ${name.toLowerCase()}`,
      'premium catalog item',
      'online shopping india',
      'express delivery products'
    ],
    faqs: [
      {
        question: `Is ${name} genuine and covered by warranty?`,
        answer: `Yes! All products sold by AAAN Enterprises are 100% original and come with official warranty coverage.`
      },
      {
        question: `How fast is shipping for ${name}?`,
        answer: `We offer same-day express dispatch. Most orders arrive within 2-4 business days with live tracking.`
      },
      {
        question: `What is the return policy for ${name}?`,
        answer: `AAAN Enterprises provides a 30-day hassle-free return and exchange policy.`
      }
    ]
  };
}
