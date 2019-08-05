import authService, { AuthService } from '../services/authService';

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
        if (!authService.verifyToken(token)) {
            console.log('token invalid');
            return reject();
        }

    } catch (e) {
        // Malformed header
        console.log('malformed header');
        console.error(e);
        return reject();
    }

    // All good
    next();
};
