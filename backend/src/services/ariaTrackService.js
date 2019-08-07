export class AriaTrackService {
    static ID = 'ariaTracks';

    #redisService;
    #ariaTracks;

    constructor(redisService) {
        this.#redisService = redisService;
    }

    start() {
        return Promise.resolve();
    }

    stop() {
        return Promise.resolve();
    }

    get activeTracks() {
        return 0;
    }
}
