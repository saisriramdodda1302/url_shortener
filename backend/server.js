import express from 'express';
import cors from 'cors';
import { shortenUrl } from './controllers/shorten.controller.js';
import { handleRedirect } from './controllers/redirect.controller.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Write Path with Rate Limiting
app.post('/api/v1/shorten', apiLimiter, shortenUrl);

// Read Path (Optimized Cache-Aside)
app.get('/:shortKey', handleRedirect);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
