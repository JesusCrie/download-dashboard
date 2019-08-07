import * as si from 'systeminformation';
import baseLogger from '../baseLogger';

const logger = baseLogger.scope('Status_');

export class StatusService {
    static ID = 'status';

    #config;
    #ariaService;
    #ariaTrackService;
    #distribution;

    constructor(config, ariaService, ariaTrackService) {
        this.#config = config;
        this.#ariaService = ariaService;
        this.#ariaTrackService = ariaTrackService;
    }

    async start() {
        // Static stats
        await si.osInfo().then(info => this.#distribution = info.distro);
        logger.info('Static stats collected');

        // Trigger this one time to prepare for the next call
        await this.networkDownloadSpeed();
    }

    async collectStats() {
        return {
            distribution: this.distribution,
            uptime: this.uptime,
            cpuLoad: await this.cpuLoad(),
            memoryLoad: await this.memoryLoad(),
            networkDownloadSpeed: await this.networkDownloadSpeed(),
            diskUsage: await this.diskUsage(),
            ariaVersion: await this.ariaVersion(),
            ariaActive: await this.ariaActive()
        }
    }

    get distribution() {
        return this.#distribution;
    }

    get uptime() {
        return si.time().uptime;
    }

    cpuLoad() {
        return si.currentLoad().then(d => d.currentload);
    }

    memoryLoad() {
        return si.mem().then(d => {
            return (1 - (d.available / d.total)) * 100;
        });
    }

    networkDownloadSpeed() {
        return si.networkStats(this.#config.networkInterface).then(d => d[0].rx_sec);
    }

    diskUsage() {
        return si.fsSize().then(d => {
            return d.find(disk => disk.fs === this.#config.diskPartition).use;
        });
    }

    ariaVersion() {
        return this.#ariaService.version();
    }

    ariaActive() {
        return this.#ariaTrackService.activeTracksCount();
    }
}
