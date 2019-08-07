import baseLogger, { downloadLogger } from '../baseLogger';

const logger = baseLogger.scope('ATracks');
const loggerStatus = downloadLogger.scope('ATracks', 'DLStatus');

export class AriaTrackService {
    static ID = 'ariaTracks';

    #redisService;
    #ariaService;

    constructor(redisService, ariaService) {
        this.#redisService = redisService;
        this.#ariaService = ariaService;
        this.call = ariaService.call.bind(ariaService);
    }

    async start() {
        // Register callbacks
        this.#ariaService.on('onDownloadStart', this.#onDownloadStart.bind(this));
        this.#ariaService.on('onDownloadPause', this.#onDownloadPause.bind(this));
        this.#ariaService.on('onDownloadComplete', this.#onDownloadComplete.bind(this));
        this.#ariaService.on('onBtDownloadComplete', this.#onDownloadComplete.bind(this));
        this.#ariaService.on('onDownloadError', this.#onDownloadError.bind(this));

        // Query everybody
        const allDownloads = await this.allDownloads();

        // Compute tracks
        const tracks = await Promise.all(allDownloads.map(async dl => {
            const track = await this.#redisService.getTrack(dl.gid);
            // Check if already download because otherwise we will never know
            track.startedAt = dl.status === 'active' ? (Date.now() / 1000 | 0) : 0;

            return track;
        }));

        // Persist them
        await this.#redisService.persistTracks(tracks);
    }

    async stop() {
        // Cleanup database
        const whitelist = (await this.allDownloads()).map(dl => dl.gid);
        await Promise.all(
            whitelist.map(gid => this.computeAndPersistTrackElapsedTime(gid))
        );

        const amount = await this.#redisService.cleanupTracks(whitelist);

        if (amount) {
            logger.info(`Cleaned ${amount} expired tracks`);
        }
    }

    #onDownloadComplete([{gid}]) {
        this.computeAndPersistTrackElapsedTime(gid).then(() => {
            loggerStatus.complete(gid);
        });
    }

    async #onDownloadStart([{gid}]) {
        // Get the associated data
        const track = await this.#redisService.getTrack(gid);
        // Update the start of the dl
        track.startedAt = Date.now() / 1000 | 0;

        await this.#redisService.persistTrack(track);
        loggerStatus.active(gid);
    }

    #onDownloadPause([{gid}]) {
        this.computeAndPersistTrackElapsedTime(gid).then(() => {
            loggerStatus.paused(gid);
        });
    }

    #onDownloadError([{gid}]) {
        this.computeAndPersistTrackElapsedTime(gid).then(() => {
            loggerStatus.error(gid);
        });
    }

    async computeAndPersistTrackElapsedTime(gid) {
        // Get the associated data
        const track = await this.#redisService.getTrack(gid);
        if (!track.startedAt) {
            loggerStatus.error(`Track (${gid}) has no 'startedAt' prop !`);
            return;
        }

        // Create field if it doesn't exist yet
        if (!track.elapsedTime) track.elapsedTime = 0;

        // Compute the time the download has been running
        track.elapsedTime += (Date.now() / 100) - track.startedAt;
        track.elapsedTime |= 0; // Round down

        // Reset startedAt for possible subsequent calls
        track.startedAt = Date.now() / 1000 | 0;

        await this.#redisService.persistTrack(track);
    }

    async allDownloads() {
        const {numActive, numWaiting, numStoppedTotal} = await this.call('getGlobalStat');

        // noinspection ES6MissingAwait
        const active = numActive > 0 ? this.call('tellActive') : Promise.resolve([]);
        // noinspection ES6MissingAwait
        const waiting = numWaiting > 0 ? this.call('tellWaiting', 0, numWaiting) : Promise.resolve([]);
        // noinspection ES6MissingAwait
        const stopped = numStoppedTotal > 0 ? this.call('tellStopped', 0, numStoppedTotal) : Promise.resolve([]);

        // Empty flatMap because the result will be of the form [[...], [...], [...]]
        return (await Promise.all([active, waiting, stopped])).flatMap(v => v);
    }

    async activeTracksCount() {
        const {numActive} = await this.call('getGlobalStat');
        return +numActive;
    }
}
