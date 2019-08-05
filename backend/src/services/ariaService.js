import childProcess from 'child_process';
import * as fs from 'fs';
import Aria2 from 'aria2';
import ariaTrackService from './ariaTrackService';

class AriaRpcClient {

    #rpcClient;
    #version;

    constructor(opts) {
        this.#rpcClient = new Aria2(opts);

        // Open socket and handshake
        //this.#rpcClient.open().then(() => {
        this.#rpcClient.multicall([['getVersion'], ['getSessionInfo']]).then(([versionInfo, sessionInfo]) => {
            this.#version = versionInfo.version;
            console.log(`[RPC Aria] Client connected (v${versionInfo.version}), session ${sessionInfo.sessionId}`);
        }).catch(console.error);
        //}).catch(console.error);
    }

    async stop() {
        await this.#rpcClient.close();
        await this.#rpcClient.call('shutdown');
    }

    get version() {
        return this.#version;
    }
}

class AriaService {

    #ariaClient;
    #ariaProcess;
    #ariaProcessRunning = false;

    constructor() {
        const opts = [
            '--enable-rpc',
            `--rpc-listen-port=${process.env.ARIA_PORT}`,
            `--rpc-secret=${process.env.ARIA_SECRET}`,
            `--save-session=${process.env.ARIA_SESSION_FILE}`
        ];

        if (process.env.ARIA_CONF) {
            opts.push(`--conf=${process.env.ARIA_CONF}`);
        }

        if (fs.existsSync(process.env.ARIA_SESSION_FILE)) {
            opts.push(`--input-file=${process.env.ARIA_SESSION_FILE}`);
        }

        // Spawn process
        this.#ariaProcess = childProcess.spawn('aria2c', opts, {killSignal: 'SIGINT'});
        this.#ariaProcessRunning = true;
        this.#ariaProcess.on('exit', () => this.#ariaProcessRunning = false);
        console.log(`[Aria] Process spawned: ${this.#ariaProcess.pid} !`);

        // Create client
        /*this.#ariaClient = new AriaRpcClient({
            host: 'localhost', port: process.env.ARIA_PORT,
            secret: process.env.ARIA_SECRET
        });*/
    }

    stop() {
        return new Promise(async (resolve, reject) => {
            if (this.#ariaClient) {
                await this.#ariaClient.stop();
                console.log(`[Aria] Client disconnected`);
            }

            this.#ariaProcess.once('exit', (code, signal) => resolve({code, signal}));
            this.#ariaProcess.once('error', err => reject(err));
            this.#ariaProcess.kill('SIGINT');
        });
    }

    get isRunning() {
        return this.#ariaProcessRunning;
    }

    get version() {
        return this.isRunning ? this.#ariaClient?.version : false;
    }

    get activeDownloads() {
        return ariaTrackService.activeTracks;
    }
}

export default new AriaService();
