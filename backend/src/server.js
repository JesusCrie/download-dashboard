import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import metricsRoutes from './routes/metrics';
import redisService from './services/redisService';
import statusService from './services/statusService';
import ariaService from './services/ariaService';
import { notFoundMiddleware, validationFailedMiddleware } from './middlewares/commonMiddlewares';
import cors from 'cors';

export const run = () => {
    const app = express();

    // Altering middleware
    app.use(cors(), bodyParser.json());

    // Routes
    app.use('/auth', authRoutes);
    app.use(metricsRoutes);

    // Fallback middleware
    app.use(validationFailedMiddleware,
        notFoundMiddleware);

    // Setup shutdown hook for graceful shutdown
    const shutdownHook = async () => {
        // Status service
        await statusService.stop();
        console.log('[Status] Stopped');

        // Redis service
        await redisService.stop();
        console.log('[Redis] Disconnected');

        // Aria service
        const ariaExit = await ariaService.stop();
        console.log(`[Aria] Stopped with code ${ariaExit.code}`);

        console.log('[App] Stopped');
        process.exit(0);
    };

    process.once('SIGHUP', shutdownHook);
    process.once('SIGINT', shutdownHook);
    process.once('SIGTERM', shutdownHook);

    const port = process.env.PORT;
    app.listen(port, () => console.log(`[Express] Started on port ${port} !`));
};
