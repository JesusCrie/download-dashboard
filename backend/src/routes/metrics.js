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
    res.json({
        distro: statusService().distribution,
        uptime: statusService().uptime,
        cpu: statusService().cpuLoad,
        memory: statusService().memoryLoad,
        netSpeed: statusService().networkDownloadSpeed,
        disk: statusService().diskUsage,
        aria: statusService().ariaVersion,
        ariaActive: statusService().ariaActive
    });
});

export default router;
