import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, GenerateVideosOperation } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Support large image payloads for 8K / high-res uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to get GoogleGenAI instance with appropriate headers
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 1. Generate Video (Veo 3: veo-3.1-fast-generate-preview)
app.post('/api/generate-video', async (req, res) => {
  try {
    const ai = getAIClient();
    const { mode, prompt, imageBase64, mimeType = 'image/png', aspectRatio = '9:16', resolution = '720p' } = req.body;

    const validatedPrompt = prompt?.trim() || 'A hyper-realistic 8K cosmic black hole with a swirling relativistic accretion disk, intense gravitational lensing, glowing white photon ring, vertical plasma jet, deep starfield, ultra high quality mobile wallpaper';
    const targetAspectRatio = aspectRatio === '16:9' ? '16:9' : '9:16';
    const targetResolution = resolution === '1080p' ? '1080p' : '720p';

    let operation;

    if (mode === 'image-to-video' && imageBase64) {
      // Clean base64 string
      const rawBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');

      operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: validatedPrompt,
        image: {
          imageBytes: rawBase64,
          mimeType: mimeType || 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: targetResolution,
          aspectRatio: targetAspectRatio,
        },
      });
    } else {
      // Text to video
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: validatedPrompt,
        config: {
          numberOfVideos: 1,
          resolution: targetResolution,
          aspectRatio: targetAspectRatio,
        },
      });
    }

    if (!operation || !operation.name) {
      throw new Error('Failed to initiate video generation operation.');
    }

    return res.json({
      success: true,
      operationName: operation.name,
      aspectRatio: targetAspectRatio,
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    return res.status(500).json({
      error: error?.message || 'Video generation failed',
      details: error?.toString(),
    });
  }
});

// 2. Poll Video Status
app.post('/api/video-status', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const ai = getAIClient();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });

    return res.json({
      done: Boolean(updated.done),
      error: updated.error || null,
      response: updated.done ? updated.response : null,
    });
  } catch (error: any) {
    console.error('Error checking video status:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to check video status',
    });
  }
});

// 3. Download Video
app.post('/api/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
    }

    const ai = getAIClient();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.status(404).json({ error: 'Video URI not available or video not ready' });
    }

    const videoRes = await fetch(uri, {
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (!videoRes.ok) {
      throw new Error(`Failed to fetch video stream from Google storage: ${videoRes.statusText}`);
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="black-hole-8k-live-wallpaper.mp4"');

    const arrayBuffer = await videoRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('Error downloading video:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to download video stream',
    });
  }
});

// 4. Gemini 4 Argon with High Thinking (ThinkingLevel.HIGH, no maxOutputTokens)
app.post('/api/gemini/think', async (req, res) => {
  try {
    const { prompt, mode = 'prompt_architect' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAIClient();

    let systemInstruction = `You are an elite theoretical astrophysicist and Hollywood cosmic VFX director. You specialize in hyper-realistic 8K black hole visuals, Einstein's General Relativity, gravitational lensing, photon spheres, relativistic Doppler beaming, frame-dragging accretion disks, and ultra-high-definition mobile lock screen wallpapers.
Provide insightful, articulate, deeply reasoned guidance, and synthesize optimal, ultra-detailed prompts for 8K video generation (Veo 3) and lock screen wallpapers.`;

    if (mode === 'prompt_architect') {
      systemInstruction += ` When asked to craft an 8K Black Hole prompt, output two sections:
1. "DEEP ASTROPHYSICS & VISUAL REASONING" (explain the relativistic physics of the visual, photon ring, Doppler boost, gravitational warp, and color palette)
2. "OPTIMIZED VEO 3 VIDEO PROMPT" (a single, intensely vivid, photorealistic 8K prompt designed to produce a mesmerizing 9:16 mobile lock screen wallpaper)`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
        systemInstruction,
      },
    });

    return res.json({
      success: true,
      text: response.text,
    });
  } catch (error: any) {
    console.error('Error with gemini-4-argon thinking query:', error);
    return res.status(500).json({
      error: error?.message || 'Reasoning query failed',
      details: error?.toString(),
    });
  }
});

// Mount Vite or serve static dist
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
