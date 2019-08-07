import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';
import tcpPortUsed from 'tcp-port-used';
import Aria2 from 'aria2';
import baseLogger from '../baseLogger';

const logger = baseLogger.scope('Aria___');

const ariaPortCheckTimeoutMs = 5_000;

export class AriaService {
    static ID = 'aria';

    #config;

    #ariaClient;
    #ariaProcess;

    constructor(opts) {
        this.#config = opts;
    }

    async start() {
        const opts = [
            '--enable-rpc',
            '--daemon', // To keep the process running when no downloads are in progress
            `--rpc-listen-port=${this.#config.port}`,
            `--rpc-secret=${this.#config.secret}`,
            `--stop-with-process=${process.pid}`,
            `--save-session=${this.#config.session}`
        ];

        if (this.#config.conf) {
            opts.push(`--conf=${this.#config.conf}`);
        }

        if (this.#config.session && fs.existsSync(this.#config.session)) {
            opts.push(`--input-file=${path.resolve(this.#config.session)}`);
        }

        // Check the port
        const {inUse} = await tcpPortUsed.check(this.#config.port);
        if (inUse) {
            throw new Error(`Port ${this.#config.port} is already taken !`);
        }

        // Spawn process
        this.#ariaProcess = childProcess.spawn('/usr/bin/aria2c', opts, {stdio: 'inherit'});
        logger.info(`Process spawned: PID ${this.#ariaProcess.pid} !`);

        // Wait until ready to connect
        await tcpPortUsed.waitUntilUsed(this.#config.port, 100, ariaPortCheckTimeoutMs);

        // Create client
        this.#ariaClient = new AriaRpcClient({
            port: this.#config.port,
            secret: this.#config.secret
        });
        await this.#ariaClient.connect();
    }

    async stop() {
        await this.#ariaClient.disconnect();
        logger.info('Aria2 will close itself with this process');
    }

    call(...args) {
        return this.#ariaClient.call(...args);
    }

    on(event, cb) {
        return this.#ariaClient.on(event, cb);
    }

    version() {
        return tcpPortUsed.check(this.#config.port)
            .then(inUse => {
                if (inUse) {
                    return this.#ariaClient.version();
                } else {
                    return null;
                }
            });
    }
}

class AriaRpcClient {

    #rpcClient;
    #version;

    constructor(opts) {
        this.#rpcClient = new Aria2(opts);
    }

    async connect() {
        await this.#rpcClient.open();
        // Test connection
        const version = await this.call('getVersion');
        this.#version = version.version;

        logger.info(`Client connected (v${version.version}) !`);

        const session = await this.call('getSessionInfo');
        logger.debug(`SessionID: ${session.sessionId}`);
    }

    disconnect() {
        return this.#rpcClient.close();
    }

    async call(...args) {
        try {
            return this.#rpcClient.call(...args);
        } catch (e) {
            logger.error(`Call failed, args: ${args}`);
            logger.error(e);
            throw e;
        }
    }

    on(event, cb) {
        return this.#rpcClient.on(event, cb);
    }

    version() {
        return this.call('getVersion').then(v => v.version);
    }
}
