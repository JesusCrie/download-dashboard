import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import serviceRegister from '../services/serviceManager';

const router = express.Router();
const {statusService} = serviceRegister;

router.get('/health', (req, res) => {
    res.status(204).send();
});

router.get('/status', authMiddleware, (req, res) => {
    res.json({
        distro: statusService.distribution,
        uptime: statusService.uptime,
        cpu: statusService.cpuLoad,
        memory: statusService.memoryLoad,
        netSpeed: statusService.networkDownloadSpeed,
        disk: statusService.diskUsage,
        aria: statusService.ariaVersion,
        ariaActive: statusService.ariaActive
    });
});

export default router;
