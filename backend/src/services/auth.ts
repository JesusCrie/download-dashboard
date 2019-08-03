import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

export interface AuthPayload {
    created: number;
    refreshed?: boolean;
}

export interface JwtConfig {
    password: string;
    secret: string;
    algorithm: string;
    lifespan: string | number;
    allowInfinite: boolean;
}

export class AuthService {
    public constructor(private config: JwtConfig) {
    }

    public checkPassword(suppliedPassword: string): boolean {
        return suppliedPassword === this.config.password;
    }

    public static extractToken(rawHeader: string, check: boolean = false): string {
        if (check) {
            if (/Bearer .+/i.test(rawHeader)) {
                throw new Error('MalformedHeader');
            }
        }

        return rawHeader.split(' ', 2)[1].trim();
    }

    public createToken(isRefresh: boolean = false): string {
        const payload: AuthPayload = {
            created: +Date(),
            refreshed: isRefresh
        };

        return jwt.sign({created: +Date()}, this.config.secret, {
            algorithm: this.config.algorithm,
            expiresIn: this.config.lifespan
        });
    }

    public verifyToken(token: string): boolean {
        try {
            const payload = jwt.decode(token) as AuthPayload;

            // Will throw if errored
            jwt.verify(token, this.config.secret, {
                algorithms: [this.config.algorithm]
            });

            return true;
        } catch (e) {
            if (e.name === 'TokenExpiredError') {
                console.trace(`Expired JWT received (at ${e.expiredAt}): ${e.message}`);
            } else if (e.name === 'JsonWebTokenError') {
                console.trace(`Errored JWT received: ${e.message}`);
            }

            return false;
        }
    }
}

const service = new AuthService({
    password: process.env.JWT_PASSWORD || '',
    secret: process.env.JWT_SECRET || '',
    algorithm: process.env.JWT_ALG || 'HS256',
    lifespan: process.env.JWT_LIFESPAN || '1d',
    allowInfinite: +(process.env.JWT_ALLOW_INFINITE || 1) === 1
});

export const authMiddleware: RequestHandler = (req, res, next) => {
    const reject = () => {
        res.status(403).end();
    };

    // Check header
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return reject();
    }

    // Check if bearer token
    try {
        const token = AuthService.extractToken(authHeader, true);

        // Check token
        if (!service.verifyToken(token)) {
            return reject();
        }

    } catch (e) {
        // Malformed header
        return reject();
    }

    // All good
    next();
};

export default service;
