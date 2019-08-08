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
        let tracks = await Promise.all(allDownloads.map(async dl => {
            const track = await this.#redisService.getTrack(dl.gid);

            // Check if already in progress because otherwise we will never know
            if (dl.status === 'active') {
                track.startedAt = Date.now() / 1000 | 0;
                loggerStatus.active(dl.gid);
            }

            return track;
        }));

        // Persist everything
        // Some are redundant but it ensures that new tracks are persisted
        await this.#redisService.persistTracks(tracks);
    }

    async stop() {
        // Cleanup database
        const whitelist = await this.allDownloads();
        await Promise.all(
            whitelist.filter(dl => dl.status === 'active')
                .map(({gid}) => this.computeAndPersistTrackElapsedTime(gid))
        );

        const amount = await this.#redisService.cleanupTracks(whitelist.map(({gid}) => gid));

        if (amount) {
            logger.info(`Cleaned ${amount} expired tracks`);
        }
    }

    #onDownloadComplete([{gid}]) {
        this.computeAndPersistTrackElapsedTime(gid, true).then(() => {
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

    async computeAndPersistTrackElapsedTime(gid, completed = false) {
        // Get the associated data
        const track = await this.#redisService.getTrack(gid);
        if (!track.startedAt) {
            loggerStatus.error(`Track (${gid}) has no 'startedAt' prop !`);
            return;
        }

        if (completed) {
            track.completed = true;
        }

        if (!track.completed) {
            // Create field if it doesn't exist yet
            if (!track.elapsedTime) track.elapsedTime = 0;

            // Compute the time the download has been running
            track.elapsedTime += (Date.now() / 1000) - track.startedAt;
            track.elapsedTime |= 0; // Round down

            // Reset startedAt for possible subsequent calls
            track.startedAt = Date.now() / 1000 | 0;
        }

        await this.#redisService.persistTrack(track);
    }

    // Utility methods

    downloadByGid(gid) {
        return this.call('tellStatus', gid);
    }

    async allDownloads() {
        let {numActive, numWaiting, numStoppedTotal} = await this.call('getGlobalStat');

        // Convert to numbers
        numActive |= 0;
        numWaiting |= 0;
        numStoppedTotal |= 0;

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

    async addUri(uris, options = undefined, position = undefined) {
        let args = [uris];

        if (position) {
            args.push({}, position);
        }

        if (options) {
            args[1] = options;
        }

        const gid = await this.call('addUri', ...args);
        return await this.downloadByGid(gid);
    }
}
