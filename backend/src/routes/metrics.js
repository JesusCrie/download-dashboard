import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import * as serviceRegister from '../services/serviceManager';
import { StatusService } from '../services/statusService';

const router = express.Router();
const statusService = serviceRegister.createGetter(StatusService.ID);

router.get('/health', (req, res) => {
    res.status(204).send();
});

router.get('/status', authMiddleware, (req, res) => {
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
    });
});

export default router;
