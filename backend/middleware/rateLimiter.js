import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient } from '../config/redis.js';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min.
    max: 100, //i limit each IP to 100 requests per window(win=15 min).
    standardHeaders: true, //returning the rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, //disabling the `X-RateLimit-*` headers
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
