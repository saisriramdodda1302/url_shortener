import { pool } from '../config/db.js';
import { redisClient } from '../config/redis.js';

export const handleRedirect = async (req, res) => {
    const { shortKey } = req.params;

    try {
        let cachedUrl = null;
        try {
            cachedUrl = await redisClient.get(shortKey);
        } catch (e) {
            console.error('Redis GET failed, falling through to Postgres:', e.message);
        }
        if (cachedUrl) return res.redirect(301, cachedUrl);

        const dbResult = await pool.query("SELECT long_url FROM urls WHERE short_url_key = $1", [shortKey]);
        if (dbResult.rows.length === 0) return res.status(404).send("<h1>URL Destination Not Found</h1>");

        const longUrl = dbResult.rows[0].long_url;
        try { await redisClient.set(shortKey, longUrl); } catch (e) { /* non-fatal */ }
        return res.redirect(301, longUrl);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};
