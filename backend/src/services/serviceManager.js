import { RedisService } from './redisService';
import { AriaService } from './ariaService';
import { AriaTrackService } from './ariaTrackService';
import { AuthService } from './authService';
import { StatusService } from './statusService';
import baseLogger from '../baseLogger';

const logger = baseLogger.scope('Manager');

export async function load() {
    logger.pending('Loading services...');

    // Instantiate everybody

    const redis = new RedisService();

    const auth = new AuthService({
        password: process.env.JWT_PASSWORD || '',
        secret: process.env.JWT_SECRET || '',
        algorithm: process.env.JWT_ALG || 'HS256',
        lifespan: process.env.JWT_LIFESPAN || '1d',
        lifespanRefresh: process.env.JWT_LIFESPAN_REFRESH || '7d'
    }, redis);

    const ariaTracks = new AriaTrackService();

    const aria = new AriaService(ariaTracks);

    const status = new StatusService({
        networkInterface: process.env.STATUS_NETWORK_INTERFACE,
        diskPartition: process.env.STATUS_DISK_PARTITION
    }, aria);

    // Start everybody
    const starter = async service => {
        try {
            await service.start();
        } catch (e) {
            errorHandler(service, e);
        }
    };

    await starter(redis);
    await starter(auth);
    await starter(ariaTracks);
    await starter(aria);
    await starter(status);

    // Register them
    register('redis', redis);
    register('auth', auth);
    register('ariaTracks', ariaTracks);
    register('aria', aria);
    register('status', status);

    logger.complete('Finished loading services !');
}

export async function unload() {
    logger.pending('Unloading registered services...');
    for (const serviceName in serviceRegister) {
        if (!serviceRegister.hasOwnProperty(serviceName))
            continue;

        const service = serviceRegister[serviceName];
        try {
            await service.stop();
        } catch (e) {
            errorHandler(service, e);
        }
    }

    logger.complete('Unloading done !');
}

const serviceRegister = {};
const register = (name, service) => {
    Object.defineProperty(serviceRegister, name, {
        value: service,
        enumerable: true
    });
};

const errorHandler = (service, err) => {
    logger.error(`Service '${service.constructor.name}' failed to start !`);
    logger.error(err);
    throw new Error('A service failed to start');
};

export default serviceRegister;
