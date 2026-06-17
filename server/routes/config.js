import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';

const router = express.Router();

router.get('/config', (req, res) => {
  const clientId = req.query.client || 'medical-clinic';
  
  // Validate clientId — prevent path traversal
  if (!/^[a-z0-9-]+$/.test(clientId)) {
    return res.status(400).json({ error: 'Invalid client ID' });
  }
  
  try {
    // Read public config (no secrets)
    const configPath = path.join(process.cwd(), 'configs', `${clientId}.json`);
    const publicConfig = JSON.parse(readFileSync(configPath, 'utf8'));
    
    // Inject secrets from environment variables
    const clientUpper = clientId.toUpperCase().replace(/-/g, '_');
    
    const secureConfig = {
      ...publicConfig,
      // Canonical tenant id for DB rows, webhooks, and dashboard filters (matches ?client= slug)
      client_id: clientId,
      webhook_url:    process.env[`${clientUpper}_WEBHOOK_URL`]    || publicConfig.webhook_url    || '',
      webhook_secret: process.env[`${clientUpper}_WEBHOOK_SECRET`] || publicConfig.webhook_secret || '',
      // ollama_endpoint intentionally omitted — LLM calls are proxied server-side via /api/llm/chat
    };
    
    res.json(secureConfig);
  } catch (err) {
    console.error(`[Config] Failed to load config for "${clientId}":`, err.message);
    res.status(404).json({ error: 'Config not found' });
  }
});

export default router;
