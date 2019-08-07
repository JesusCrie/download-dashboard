import childProcess from 'child_process';
import fs from 'fs';
import tcpPortUsed from 'tcp-port-used';
import Aria2 from 'aria2';
import baseLogger from '../baseLogger';

const logger = baseLogger.scope('Aria___');

const ariaPortCheckTimeoutMs = 5_000;

export class AriaService {
    static ID = 'aria';

    #config;

    #ariaTrackService;
    #ariaClient;

    #ariaProcess;

    constructor(opts, ariaTrackService) {
        this.#config = opts;
        this.#ariaTrackService = ariaTrackService;
    }

    async start() {
        const opts = [
            '--enable-rpc',
            `--rpc-listen-port=${this.#config.port}`,
            `--rpc-secret=${this.#config.secret}`,
            `--stop-with-process=${process.pid}`,
            `--save-session=${this.#config.session}`
        ];

        if (this.#config.conf) {
            opts.push(`--conf=${this.#config.conf}`);
        }

        if (this.#config.session && fs.existsSync(this.#config.session)) {
            opts.push(`--input-file=${this.#config.session}`);
        }

        // Check the port
        const {inUse} = await tcpPortUsed.check(this.#config.port);
        if (inUse) {
            throw new Error(`Port ${this.#config.port} is already taken !`);
        }

        // Spawn process
        this.#ariaProcess = childProcess.spawn('/usr/bin/aria2c', opts);
        logger.info(`Process spawned: PID ${this.#ariaProcess.pid} !`);

        // Wait until ready to connect
        await tcpPortUsed.waitUntilUsed(this.#config.port, 100, ariaPortCheckTimeoutMs);

        // Create client
        this.#ariaClient = new AriaRpcClient({
            port: this.#config.port,
            secret: this.#config.secret
        });
        this.#ariaClient.connect();

        logger.complete('Ready !');
    }

    async stop() {
        logger.info('Aria2 will close itself with this process');
    }

    get version() {
        return tcpPortUsed.check(this.#config.port)
            .then(inUse => {
                if (inUse) {
                    return this.#ariaClient.version;
                } else {
                    return null;
                }
            });
    }

    get activeDownloads() {
        return Promise.resolve(this.#ariaTrackService.activeTracks);
    }
}

class AriaRpcClient {

    #rpcClient;
    #version;

    constructor(opts) {
        this.#rpcClient = new Aria2(opts);
    }

    async connect() {
        // Test connection
        const version = await this.call('getVersion');
        this.#version = version.version;

        logger.complete(`Client connected (v${version.version}) !`);
    }

    async call(...args) {
        try {
            return await this.#rpcClient.call(...args);
        } catch (e) {
            logger.error(`Call failed, args: ${args}`);
            logger.error(e);
            throw e;
        }
    }

    get version() {
        return this.call('getVersion').then(v => v.version);
    }
}
