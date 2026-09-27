import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'ShadowGrid Engine',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // In-memory cache to conserve Gemini API quota across rapid tab switches
  const explanationCache = new Map<string, { text: string; model: string; timestamp: string }>();

  // AI Explanation proxy endpoint
  app.post('/api/explain', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY not configured on server',
          fallbackRecommended: true,
        });
      }

      const { prompt, context } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      // Check cache key (buildingCode + utility + deviationPercent)
      const cacheKey = `${context?.buildingCode || 'bldg'}-${context?.utility || 'util'}-${context?.deviationPercent || 0}`;
      const cached = explanationCache.get(cacheKey);
      if (cached) {
        return res.json({
          ...cached,
          cached: true,
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are ShadowGrid AI, an infrastructure diagnostics intelligence engine.
Your purpose: Translate strictly calculated anomaly metrics into concise, professional technical intelligence for facility directors, utility engineers, and building managers.
Rules:
- Never hallucinate unmeasured numbers. Refer strictly to the metrics supplied in the prompt.
- Always use professional engineering terminology (e.g. 'continuous baseflow', 'hydraulic pressure drop', 'thermal runaway', 'apparent impedance', 'persistent deviation').
- State findings in terms of 'Likely cause' or 'Possible cause' (probabilistic, never claim 100% absolute certainty).
- Provide a brief 2-3 sentence executive synopsis, 3 specific technical evidence bullets, and a prioritized intervention checklist.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${prompt}\n\nContext Data:\n${JSON.stringify(context || {}, null, 2)}`,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      const resultPayload = {
        text: response.text || '',
        model: 'gemini-3.8-flash',
        timestamp: new Date().toISOString(),
      };

      // Store in memory cache
      explanationCache.set(cacheKey, resultPayload);

      return res.json(resultPayload);
    } catch (err: any) {
      const isQuotaExceeded = err?.status === 'RESOURCE_EXHAUSTED' || err?.message?.includes('429') || err?.message?.includes('quota');
      if (isQuotaExceeded) {
        console.warn('[ShadowGrid Server] Gemini quota limit reached (429 RESOURCE_EXHAUSTED). Gracefully triggering deterministic fallback.');
      } else {
        console.error('Gemini API Error:', err);
      }

      return res.status(isQuotaExceeded ? 429 : 500).json({
        error: isQuotaExceeded ? 'Gemini API free tier quota exceeded. Switching seamlessly to analytical engine rule-base.' : (err.message || 'Gemini inference failed'),
        fallbackRecommended: true,
        isQuotaExceeded: Boolean(isQuotaExceeded),
      });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ShadowGrid] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
