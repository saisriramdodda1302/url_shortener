import { pool } from '../config/db.js';
import { redisClient } from '../config/redis.js';
import { encodeBase62 } from '../utils/base62.js';
import { generateId } from '../utils/idGenerator.js';

export const shortenUrl = async (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: "Long URL is required" });

    try {
        //1: checking if the exact long URL was previously there=>to save storage.
        const existing = await pool.query("SELECT short_url_key FROM urls WHERE long_url = $1 LIMIT 1", [longUrl]);
        if (existing.rows.length > 0) {
            return res.status(200).json({ shortKey: existing.rows[0].short_url_key });
        }

        //2:system des unique ID generation.
        const uniqueId = generateId();//snowflake algo.
        const shortKey = encodeBase62(uniqueId).slice(0, 7);

        //3:pg database write.
        await pool.query(
            "INSERT INTO urls (id, short_url_key, long_url) VALUES ($1, $2, $3)",
            [uniqueId, shortKey, longUrl]
        );

        //4:backfilling Redis to take adv of the cache instantly.
        await redisClient.set(shortKey, longUrl);

        return res.status(201).json({ shortKey });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Processing Failure" });
    }
};
