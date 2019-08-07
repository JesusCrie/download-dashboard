import * as jwt from 'jsonwebtoken';

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

    start() {
        return Promise.resolve();
    }

    stop() {
        return Promise.resolve();
    }

    checkPassword(suppliedPassword) {
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
