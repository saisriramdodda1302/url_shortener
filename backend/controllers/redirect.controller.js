import { pool } from '../config/db.js';
import { redisClient } from '../config/redis.js';

export const handleRedirect = async (req, res) => {
    const { shortKey } = req.params;

    try {
        //query goes to redis db.
        const cachedUrl = await redisClient.get(shortKey);
        if (cachedUrl) {
            return res.redirect(301, cachedUrl); //301 permanent Cache for browser eff.
        }
        //if not in cache, then cache Miss => then pg db query.
        const dbResult = await pool.query("SELECT long_url FROM urls WHERE short_url_key = $1", [shortKey]);
        if (dbResult.rows.length === 0) {
            return res.status(404).send("<h1>URL Destination Not Found</h1>");
        }

        const longUrl = dbResult.rows[0].long_url;

        //adding vals to Redis db to protect the database from traffic.
        await redisClient.set(shortKey, longUrl);
        return res.redirect(301, longUrl);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};
