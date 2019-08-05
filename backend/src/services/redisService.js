import * as redis from 'redis';
import * as jwt from 'jsonwebtoken';

const REFRESH_TOKEN_KEY = 'refreshTokens';

export class RedisService {

    constructor() {
        this.client = redis.createClient(+(process.env.REDIS_PORT || 6379));

        // Query simple key to check connection
        this.client.get('__status__', (err, reply) => {
            if (err) {
                console.error('[Redis]: ERROR, redis seems to be offline !');
                throw err;
            }

            console.log('[Redis] Connected !');
        });
    }

    stop() {
        return new Promise(resolve => {
            this.client.quit(resolve);
        });
    }

    registerRefreshToken(token) {
        this.client.sadd(REFRESH_TOKEN_KEY, token);
    }

    checkRefreshTokenExists(token) {
        return new Promise((resolve, reject) => {
            this.client.sismember(REFRESH_TOKEN_KEY, token, (err, reply) => {
                if (err) {
                    reject(err);
                }

                resolve(reply === 1);
            });
        });

    }

    cleanupRefreshTokens() {
        this.client.smembers(REFRESH_TOKEN_KEY, (err, reply) => {
            if (err) {
                console.error(err);
                return;
            }

            const expired = reply.filter(token => {
                const decoded = jwt.decode(token);
                return +decoded.exp <= (+new Date() / 1000);
            });

            this.client.srem(REFRESH_TOKEN_KEY, expired);
        });
    }
}

export default new RedisService();
