import * as redis from 'redis';
import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';
import baseLogger from '../baseLogger';

const logger = baseLogger.scope('Redis__');

const REFRESH_TOKEN_KEY = 'refreshTokens';

const TRACKS_NAMESPACE = 'ariaTracks';
const TRACKS_INDEX_KEY = `${TRACKS_NAMESPACE}:index`;

export class RedisService {
    static ID = 'redis';

    #config;
    #client;

    constructor(config) {
        this.#config = config;
    }

    start() {
        return new Promise((resolve, reject) => {
            this.#client = redis.createClient({
                host: this.#config.host,
                port: this.#config.port,
                path: this.#config.unixSocket,
                url: this.#config.url,
                db: this.#config.db,
                prefix: this.#config.prefix,
                password: this.#config.password,
                string_numbers: false
            });

            // Error handler
            this.#client.on('error', (err) => {
                reject(err);
            });

            // Success handler
            this.#client.on('connect', () => {
                resolve();
            });
        }).then(() => {
            this.#promisify();
        });
    }

    #promisify() {
        // Promisify the used methods
        const promisifyAndBind = func => {
            return promisify(func).bind(this.#client);
        };

        this.clientGet = promisifyAndBind(this.#client.get);
        this.clientSet = promisifyAndBind(this.#client.set);
        this.clientDel = promisifyAndBind(this.#client.del);
        this.clientSadd = promisifyAndBind(this.#client.sadd);
        this.clientSrem = promisifyAndBind(this.#client.srem);
        this.clientSismember = promisifyAndBind(this.#client.sismember);
        this.clientSmembers = promisifyAndBind(this.#client.smembers);
        this.clientQuit = promisifyAndBind(this.#client.quit);
        this.clientHgetall = promisifyAndBind(this.#client.hgetall);
        this.clientHmset = promisifyAndBind(this.#client.hmset);
    }

    async stop() {
        await this.clientQuit();
        logger.success('Successfully disconnected !');
    }

    registerRefreshToken(token) {
        return this.clientSadd(REFRESH_TOKEN_KEY, token);
    }

    async checkRefreshTokenExists(token) {
        try {
            const tokenExists = await this.clientSismember(REFRESH_TOKEN_KEY, token);
            return !!tokenExists;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    async cleanupRefreshTokens() {
        try {
            const tokens = await this.clientSmembers(REFRESH_TOKEN_KEY);
            const expired = tokens.filter(token => {
                const decoded = jwt.decode(token);
                return +decoded.exp <= (Date.now() / 1000);
            });

            if (expired.length) {
                await this.clientSrem(REFRESH_TOKEN_KEY, expired);
            }

            return expired.length;
        } catch (e) {
            logger.error(e);
            return 0;
        }
    }

    async getTrackIndex() {
        try {
            return await this.clientSmembers(TRACKS_INDEX_KEY);
        } catch (e) {
            logger.error(e);
            return [];
        }
    }

    async getTrack(gid) {
        try {
            return RedisService.normalizeTrack({
                gid, ...await this.clientHgetall(`${TRACKS_NAMESPACE}:${gid}`)
            });
        } catch (e) {
            logger.error(e);
            return {gid};
        }
    }

    async getTracks() {
        try {
            const ids = await this.clientSmembers(TRACKS_INDEX_KEY);

            const tracks = [];
            for (const gid of ids) {
                tracks.push(RedisService.normalizeTrack({
                    gid, ...await this.clientHgetall(`${TRACKS_NAMESPACE}:${gid}`)
                }));
            }

            return tracks;
        } catch (e) {
            logger.error(e);
            return [];
        }
    }

    static normalizeTrack(track) {
        if (!track.gid) {
            throw new TypeError('Track must have a GID !');
        }

        track.addedAt = +track.addedAt || 0;
        track.startedAt = +track.startedAt || 0;
        track.elapsedTime = +track.elapsedTime || 0;
        track.completed = !!track.completed;

        return track;
    }

    static prepareTrack(track) {
        if (!track.gid) {
            throw new TypeError('Track must have a GID !');
        }

        if (!track.addedAt) {
            track.addedAt = Date.now() / 1000 | 0;
        }

        return track;
    }

    persistTrack(track) {
        track = RedisService.prepareTrack(track);
        const {gid, ...data} = track;

        return Promise.all([
            this.clientSadd(TRACKS_INDEX_KEY, gid),
            this.clientHmset(`${TRACKS_NAMESPACE}:${gid}`, data)
        ]);
    }

    persistTracks(tracks) {
        tracks = tracks.map(t => RedisService.prepareTrack(t));

        return Promise.all([
            this.clientSadd(TRACKS_INDEX_KEY, tracks.map(t => t.gid)),
            tracks.map(({gid, ...data}) => this.clientHmset(`${TRACKS_NAMESPACE}:${gid}`, data))
        ]);
    }

    removeTracks(ids) {
        return Promise.all([
            this.clientDel(ids.map(gid => `${TRACKS_NAMESPACE}:${gid}`)), // Delete timestamps
            this.clientSrem(TRACKS_INDEX_KEY, ids) // Delete from index
        ]);
    }

    async cleanupTracks(toKeep) {
        try {
            const ids = await this.clientSmembers(TRACKS_INDEX_KEY);
            const expired = ids.filter(gid => !toKeep.includes(gid));

            if (expired.length > 0) {
                await this.removeTracks(expired);
            }
            return expired.length;
        } catch (e) {
            logger.error(e);
            return 0;
        }
    }
}
