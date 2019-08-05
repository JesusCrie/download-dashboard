import * as si from 'systeminformation';
import ariaService from './ariaService';

class StatusService {

    static #networkInterface = process.env.STATUS_NETWORK_INTERFACE;
    static #diskPartition = process.env.STATUS_DISK_PARTITION;

    #collectLoopId;

    #distribution;
    #uptime;
    #cpuLoad;
    #memoryLoad;
    #networkDlSpeed;
    #diskUsage;
    #ariaVersion;
    #ariaActive;

    constructor() {
        console.log('[Status] Starting...');

        // Static stats
        si.osInfo().then(info => this.#distribution = info.distro);

        // Start collecting stats 5s from now
        setTimeout(() => {
            this.#collectLoopId = setInterval(this.#collectStats.bind(this), 1000);
            console.log('[Status] Started !');
        }, 5_000);
    }

    async stop() {
        clearInterval(this.#collectLoopId);
    }

    async #collectStats() {
        this.#uptime = si.time().uptime;
        this.#cpuLoad = (await si.currentLoad()).currentload;

        const memoryInfo = await si.mem();
        this.#memoryLoad = 1 - (memoryInfo.available / memoryInfo.total);

        this.#networkDlSpeed = (await si.networkStats(StatusService.#networkInterface))[0].rx_sec;
        this.#diskUsage = (await si.fsSize())
            .filter(d => d.fs === StatusService.#diskPartition)[0]
            .use;

        this.#ariaVersion = ariaService.version;
        this.#ariaActive = ariaService.activeDownloads;
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

export default new StatusService();
