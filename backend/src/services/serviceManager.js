import { RedisService } from './redisService';
import { AriaService } from './ariaService';
import { AriaTrackService } from './ariaTrackService';
import { AuthService } from './authService';
import { StatusService } from './statusService';
import baseLogger from '../baseLogger';

const logger = baseLogger.scope('Manager');

const serviceGenerator = function* () {
    const redis = new RedisService({
        unixSocket: process.env.REDIS_UNIX_SOCKET || undefined,
        host: process.env.REDIS_HOST || undefined,
        port: +process.env.REDIS_PORT || 6379,
        url: process.env.REDIS_URL || undefined,
        db: process.env.REDIS_DB || undefined,
        prefix: process.env.REDIS_PREFIX || undefined,
        password: process.env.REDIS_PASSWORD || undefined
    });

    const aria = new AriaService({
        port: +process.env.ARIA_PORT || 6800,
        secret: process.env.ARIA_SECRET || '',
        session: process.env.ARIA_SESSION_FILE || './aria2.session.gz',
        conf: process.env.ARIA_CONF || '$XDG_CONFIG_HOME/aria2/aria2.conf'
    });

    const ariaTracks = new AriaTrackService(redis, aria);

    const status = new StatusService({
        networkInterface: process.env.STATUS_NETWORK_INTERFACE,
        diskPartition: process.env.STATUS_DISK_PARTITION
    }, aria, ariaTracks);

    const auth = new AuthService({
        password: process.env.AUTH_MASTER_PASSWORD || undefined,
        secret: process.env.AUTH_JWT_SECRET || '1234',
        algorithm: process.env.AUTH_JWT_ALG || 'HS256',
        lifespan: process.env.AUTH_JWT_LIFESPAN || '1d',
        lifespanRefresh: process.env.AUTH_JWT_LIFESPAN_REFRESH || '7d'
    }, redis);

    // Return them in the correct order
    yield redis;
    yield aria;
    yield ariaTracks; // redis, aria
    yield status; // aria, ariaTracks
    yield auth; // redis
};

const load = async () => {
    logger.pending('Loading services...');

    // Instantiate everybody
    const services = [...serviceGenerator()];

    // Start everybody
    for (const index in services) {
        const service = services[index];
        try {
            if (typeof service['start'] === 'function') {
                await service.start();
            }

            logger.pending(`[${+index + 1}/${services.length}] Service ${service.constructor.ID} started`);
        } catch (e) {
            logger.error('A service failed to start !');
            errorHandler(service, e);
            throw e;
        }
    }

    // Register everybody
    register(...services);

    logger.complete('Finished loading services !');
};

const unload = async () => {
    logger.pending(`Unloading ${serviceRegister.size} services...`);

    // Unload in reverse order to prevent any dependency problem between services
    for (const service of [...serviceRegister.values()].reverse()) {
        try {
            if (typeof service['stop'] === 'function') {
                await service.stop();
            }

            logger.pending(`Service ${service.constructor.ID} stopped`);
        } catch (e) {
            logger.error('A service failed to stop !');
            errorHandler(service, e);
            throw e;
        }
    }

    logger.complete('Unloading done !');
};

const serviceRegister = new Map();
const register = (...services) => {
    for (const service of services) {
        serviceRegister.set(service.constructor.ID, service);
    }
};

const createGetter = (id) => {
    return () => {
        return serviceRegister.get(id);
    };
};

const errorHandler = (service, err) => {
    logger.error(`Service '${service.constructor.ID}' failed !`);
    logger.error(err);
};

export {
    load, unload,
    serviceRegister as default,
    createGetter
};
