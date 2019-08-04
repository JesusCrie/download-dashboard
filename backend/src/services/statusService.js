import getos from 'getos';
import * as os from 'os';

class StatusService {

    static getDistribution() {
        return new Promise((resolve, reject) => {
            getos((err, os) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(os.os === 'linux' ? os.dist : os.os);
            });
        });
    }

    static getUptime() {
        return os.uptime();
    }

    getCpuLoad() {
        const collector = () => {
            const times = os.cpus()
                .map(v => v.times)
                .reduce((prev, next) => {
                    prev.user += next.user;
                    prev.nice += next.nice;
                    prev.sys += next.sys;
                    prev.idle += next.idle;
                    prev.irq += next.irq;
                    return prev;
                });

            return {
                total: times.user + times.nice + times.sys + times.idle + times.irq,
                idle: times.idle
            };
        };

        const stats1 = collector();
        return new Promise(resolve => {
            setTimeout(() => {
                const stats2 = collector();

                const total = stats2.total - stats1.total;
                const idle = stats2.idle - stats1.idle;

                resolve({
                    total, idle,
                    percent: idle / total
                });
            });
        });
    }
}
