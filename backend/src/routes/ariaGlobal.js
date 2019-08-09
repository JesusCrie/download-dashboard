import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import * as serviceManager from '../services/serviceManager';
import { AriaTrackService } from '../services/ariaTrackService';
import { commonOk } from '../commonPayload';
import { AriaService } from '../services/ariaService';
import { trackerLogger } from '../baseLogger';

const router = Router();
const ariaService = serviceManager.createGetter(AriaService.ID);
const ariaTrackService = serviceManager.createGetter(AriaTrackService.ID);

router.get('/stats', authMiddleware, (req, res, next) => {

    ariaService().globalStats().then(stats => {
        res.json(stats);
    }).catch(err => {
        trackerLogger.error(err);
        next(err);
    });
});

router.post('/purge', authMiddleware, (req, res, next) => {

    ariaTrackService().purge().then(() => {
        res.json(commonOk);
    }).catch(err => {
        trackerLogger.error(err);
        next(err);
    });
});

export default router;
