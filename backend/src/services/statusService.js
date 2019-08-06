import * as si from 'systeminformation';
import baseLogger from '../baseLogger';

const logger = baseLogger.scope('Status_');

export class StatusService {

    #ariaService;
    #networkInterface = process.env.STATUS_NETWORK_INTERFACE;
    #diskPartition = process.env.STATUS_DISK_PARTITION;

    #collectLoopId;

    #distribution;
    #uptime;
    #cpuLoad;
    #memoryLoad;
    #networkDlSpeed;
    #diskUsage;
    #ariaVersion;
    #ariaActive;

    constructor(config, ariaService) {
        this.#networkInterface = config.networkInterface;
        this.#diskPartition = config.diskPartition;
        this.#ariaService = ariaService;
    }

    async start() {
        // Static stats
        await si.osInfo().then(info => this.#distribution = info.distro);

        // Start collector
        this.#collectLoopId = setInterval(this.#collectStats.bind(this), 1_000);
        logger.complete('Started !');
    }

    async stop() {
        clearInterval(this.#collectLoopId);
        logger.complete('Cleanup done !');
    }

    async #collectStats() {
        this.#uptime = si.time().uptime;
        this.#cpuLoad = (await si.currentLoad()).currentload;

        const memoryInfo = await si.mem();
        this.#memoryLoad = 1 - (memoryInfo.available / memoryInfo.total);

        this.#networkDlSpeed = (await si.networkStats(this.#networkInterface))[0].rx_sec;
        this.#diskUsage = (await si.fsSize())
            .filter(d => d.fs === this.#diskPartition)[0]
            .use;

        this.#ariaVersion = this.#ariaService.version;
        this.#ariaActive = this.#ariaService.activeDownloads;
    }

    get distribution() {
        return this.#distribution;
    }

    get uptime() {
        return this.#uptime;
    }

    get cpuLoad() {
        return this.#cpuLoad;
    }

    get memoryLoad() {
        return this.#memoryLoad;
    }

    get networkDownloadSpeed() {
        return this.#networkDlSpeed;
    }

    get diskUsage() {
        return this.#diskUsage;
    }

    get ariaVersion() {
        return this.#ariaVersion;
    }

    get ariaActive() {
        return this.#ariaActive;
    }
}
