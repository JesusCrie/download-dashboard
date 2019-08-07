import * as si from 'systeminformation';
import baseLogger from '../baseLogger';

const logger = baseLogger.scope('Status_');

export class StatusService {
    static ID = 'status';

    #ariaService;
    #networkInterface = process.env.STATUS_NETWORK_INTERFACE;
    #diskPartition = process.env.STATUS_DISK_PARTITION;
    #distribution;

    constructor(config, ariaService) {
        this.#networkInterface = config.networkInterface;
        this.#diskPartition = config.diskPartition;
        this.#ariaService = ariaService;
    }

    async start() {
        // Static stats
        await si.osInfo().then(info => this.#distribution = info.distro);
        logger.complete('Started !');
    }

    async stop() {
        logger.complete('Stopped !');
    }

    async collectStats() {
        return {
            distribution: this.distribution,
            uptime: this.uptime,
            cpuLoad: await this.cpuLoad,
            memoryLoad: await this.memoryLoad,
            networkDownloadSpeed: await this.networkDownloadSpeed,
            diskUsage: await this.diskUsage,
            ariaVersion: await this.ariaVersion,
            ariaActive: await this.ariaActive
        }
    }

    get distribution() {
        return this.#distribution;
    }

    get uptime() {
        return si.time().uptime;
    }

    get cpuLoad() {
        return si.currentLoad().then(d => d.currentload);
    }

    get memoryLoad() {
        return si.mem().then(d => {
            return (1 - (d.available / d.total)) * 100;
        });
    }

    get networkDownloadSpeed() {
        return si.networkStats(this.#networkInterface).then(d => d[0].rx_sec);
    }

    get diskUsage() {
        return si.fsSize().then(d => {
            return d.find(disk => disk.fs === this.#diskPartition).use;
        });
    }

    get ariaVersion() {
        return this.#ariaService.version;
    }

    get ariaActive() {
        return this.#ariaService.activeDownloads;
    }
}
