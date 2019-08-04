import express from 'express';
import { validate } from '../validator';
import schemas from '../schemas/schemas';

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(204).send();
});

router.get('/status', validate({query: schemas.statusFields}), (req, res) => {
    res.json(req.query);
});

export default router;
