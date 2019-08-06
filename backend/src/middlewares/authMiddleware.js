import { AuthService } from '../services/authService';
import * as serviceRegister from '../services/serviceManager';

const authService = serviceRegister.createGetter(AuthService.ID);

export default (req, res, next) => {
    const reject = () => {
        // Unauthorized
        res.status(403).json({
            error: true,
            code: 403,
            message: 'Forbidden'
        });
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
        if (!authService().verifyToken(token)) {
            return reject();
        }

    } catch (e) {
        // Malformed header
        return reject();
    }

    // All good
    next();
};
