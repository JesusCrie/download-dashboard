import * as jwt from 'jsonwebtoken';
import baseLogger from '../baseLogger';

const logger = baseLogger.scope();

export class AuthenticationError extends Error {
    constructor(message) {
        super();
        this.name = 'AuthenticationError';
        this.message = message;
    }
}

export class AuthService {
    static ID = 'auth';

    #config;
    #redisService;

    constructor(config, redisService) {
        this.#config = config;
        this.#redisService = redisService;
    }

    async start() {
        this.#redisService.cleanupRefreshTokens()
            .then(amount => {
                amount && logger.info(`Cleaned ${amount} expired refresh tokens`);
            })
            .catch(e => {
                logger.warn('Failed to cleanup refresh tokens');
                logger.warn(`Cause: ${e?.message || e}`);
            });
    }

    checkPassword(suppliedPassword) {
        if (!this.#config.password)
            return true;

        return suppliedPassword === this.#config.password;
    }

    static extractToken(rawHeader, check = false) {
        if (check) {
            if (!/Bearer .+/i.test(rawHeader)) {
                throw new Error('MalformedHeader');
            }
        }

        return rawHeader.split(' ', 2)[1].trim();
    }

    createToken() {
        const payload = {
            created: Date.now()
        };

        return jwt.sign(payload, this.#config.secret, {
            algorithm: this.#config.algorithm,
            expiresIn: this.#config.lifespan
        });
    }

    createRefreshToken() {
        const payload = {
            created: Date.now()
        };

        const token = jwt.sign(payload, this.#config.secret, {
            algorithm: this.#config.algorithm,
            expiresIn: this.#config.lifespanRefresh
        });

        this.#redisService.registerRefreshToken(token);
        return token;
    }

    verifyToken(token) {
        try {
            // Will throw if errored
            jwt.verify(token, this.#config.secret, {
                algorithms: [this.#config.algorithm]
            });

            return true;
        } catch (e) {
            throw new AuthenticationError(e?.message || e);
        }
    }

    async verifyRefreshToken(token) {
        try {
            jwt.verify(token, this.#config.secret, {
                algorithms: [this.#config.algorithm]
            });

            return await this.#redisService.checkRefreshTokenExists(token);
        } catch (e) {
            // Token invalid
            throw new AuthenticationError(e?.message || e);
        }
    }
}
