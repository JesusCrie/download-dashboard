import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import * as serviceRegister from '../services/serviceManager';
import { StatusService } from '../services/statusService';
import { commonOk } from '../commonPayload';
import { trackerLogger } from '../baseLogger';

const router = express.Router();
const statusService = serviceRegister.createGetter(StatusService.ID);

router.get('/health', (req, res) => {
    res.status(200).json(commonOk);
});

router.get('/status', authMiddleware, (req, res, next) => {
    statusService().collectStats().then(stats => {
        res.json({
            distro: stats.distribution,
            uptime: stats.uptime,
            cpu: stats.cpuLoad,
            memory: stats.memoryLoad,
            netSpeed: stats.networkDownloadSpeed,
            disk: stats.diskUsage,
            aria: stats.ariaVersion,
            ariaActive: stats.ariaActive
        });
    }).catch(err => {
        trackerLogger.track(err);
        next(err);
    });
});

export default router;
