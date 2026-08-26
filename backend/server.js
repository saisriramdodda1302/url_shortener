import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';
import { shortenUrl } from './controllers/shorten.controller.js';
import { handleRedirect } from './controllers/redirect.controller.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { redisClient } from './config/redis.js';   // ← ADD THIS

const app = express();
const PORT = process.env.PORT || 5000;

//render runs my app behind a reverse proxy. Without this, req.ip is the,
//proxy's IP, so express-rate-limit buckets every visitor together and logs,
//ERR_ERL_UNEXPECTED_X_FORWARDED_FOR.
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

//health check: used by Render.
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// cron-job.org hits this every 10 minutes — 4,320 calls/month.
// The SET is what stops Upstash archiving the DB after 30 days idle;
// PING doesn't count as activity, only real data operations do.
app.get('/keepalive', async (req, res) => {
    try {
        await redisClient.set('keepalive', Date.now().toString());
        res.status(200).json({ status: 'ok', redis: 'up' });
    } catch (err) {
        res.status(200).json({ status: 'ok', redis: 'down' });
    }
});
//write Path with Rate Limiting
app.post('/api/v1/shorten', apiLimiter, shortenUrl);

//read Path(Optimized Cache-Aside)
app.get('/:shortKey', handleRedirect);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});