export class AriaTrackService {
    static ID = 'ariaTracks';

    #ariaTracks;

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
