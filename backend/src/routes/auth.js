import express from 'express';
import { validate } from '../validator';
import schemas from '../schemas/schemas';
import serviceRegister from '../services/serviceManager';


const router = express.Router();
const {authService} = serviceRegister;

router.post('/', validate({body: schemas.auth}), (req, res) => {

    if (!authService.checkPassword(req.body.password)) {
        res.status(403).json({
            error: true,
            code: 400,
            message: 'Authentication failed'
        });
        return;
    }

    res.json({
        token: authService.createToken(),
        refreshToken: authService.createRefreshToken()
    });
});

router.post('/refresh', validate({body: schemas.authRefresh}), async (req, res) => {

    if (!await authService.verifyRefreshToken(req.body.refreshToken)) {
        res.status(403).end();
        return;
    }

    res.json({
        token: authService.createToken()
    });
});

export default router;
