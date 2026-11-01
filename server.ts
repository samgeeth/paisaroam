import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateTripPlanWithGemini } from './api/gemini-service.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Endpoints
app.post('/api/gemini/plan-trip', async (req, res) => {
  try {
    const result = await generateTripPlanWithGemini(req.body);
    res.json(result);
  } catch (error: unknown) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', brand: 'PAISAROAM' });
});

// Serve frontend static build
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`PAISAROAM server running on http://0.0.0.0:${PORT}`);
});
