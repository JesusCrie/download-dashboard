import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(204).send();
});

router.get('/status', (req, res) => {
    res.json({test: 42_000});
});

export default router;
