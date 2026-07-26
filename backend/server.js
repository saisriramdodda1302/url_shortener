import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';
import { shortenUrl } from './controllers/shorten.controller.js';
import { handleRedirect } from './controllers/redirect.controller.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();
const PORT = process.env.PORT || 5000;

//render runs my app behind a reverse proxy. Without this, req.ip is the,
//proxy's IP, so express-rate-limit buckets every visitor together and logs,
//ERR_ERL_UNEXPECTED_X_FORWARDED_FOR.
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

//health check: used by Render, and by the uptime pinger that stops the free
//instance sleeping. MUST be declared before the /:shortKey catch-all.
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'ok', db: 'up' });
    } catch (err) {
        res.status(503).json({ status: 'degraded', db: 'down' });
    }
});

//write Path with Rate Limiting
app.post('/api/v1/shorten', apiLimiter, shortenUrl);

//read Path(Optimized Cache-Aside)
app.get('/:shortKey', handleRedirect);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});