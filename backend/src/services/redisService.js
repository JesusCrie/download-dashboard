import * as redis from 'redis';
import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';
import baseLogger from '../baseLogger';

const logger = baseLogger.scope('Redis__');

const REFRESH_TOKEN_KEY = 'refreshTokens';

export class RedisService {

    #client;

    start() {
        return new Promise((resolve, reject) => {
            this.#client = redis.createClient(+(process.env.REDIS_PORT || 6379));

            // Error handler
            this.#client.on('error', (err) => {
                reject(err);
            });

            // Success handler
            this.#client.on('connect', () => {
                resolve();
            });
        }).then(() => {
            logger.complete('Connected !');
        });
    }

    async stop() {
        await promisify(this.#client.quit).bind(this.#client)();
        logger.success('Successfully disconnected !');
    }

    registerRefreshToken(token) {
        this.#client.sadd(REFRESH_TOKEN_KEY, token);
    }

    checkRefreshTokenExists(token) {
        return new Promise((resolve, reject) => {
            this.#client.sismember(REFRESH_TOKEN_KEY, token, (err, reply) => {
                if (err) {
                    reject(err);
                }

                resolve(reply === 1);
            });
        });

    }

    cleanupRefreshTokens() {
        this.#client.smembers(REFRESH_TOKEN_KEY, (err, reply) => {
            if (err) {
                console.error(err);
                return;
            }

            const expired = reply.filter(token => {
                const decoded = jwt.decode(token);
                return +decoded.exp <= (+new Date() / 1000);
            });

            this.#client.srem(REFRESH_TOKEN_KEY, expired);
        });
    }
}
