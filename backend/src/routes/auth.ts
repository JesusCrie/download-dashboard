import express from 'express';
import authService, { authMiddleware } from '../services/auth';
import { AuthHolder, validateAuthHolder } from '../schemas/AuthHolder';
import { TokenHolder } from '../schemas/TokenHolder';

const router = express.Router();

router.post('/', (req, res) => {
    if (!validateAuthHolder(req.body)) {
        res.status(403).end();
        return;
    }

    const payload = req.body as AuthHolder;
    if (!authService.checkPassword(payload.password)) {
        res.status(403).end();
        return;
    }

    const body: TokenHolder = {token: authService.createToken(payload.infinite)};
    res.json(body);
});

router.get('/refresh', authMiddleware, (req, res) => {
    const body: TokenHolder = {token: authService.createToken()}
});

export default router;
