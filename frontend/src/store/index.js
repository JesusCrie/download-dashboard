import Vue from 'vue';
import Vuex from 'vuex';
import drawer from './modules/drawer';
import persistence from './modules/persistence';
import auth from './modules/auth';

Vue.use(Vuex);

/*export interface NavigationLink {
    displayName: string;
    routeName: string;
    iconName: string;
}*/

/*export interface StatusIndicator {
    title: string;
    value: string | number;
    icon?: string;
    cssColor?: string | number;
    cssClasses?: string;
}*/

export class TrackStatus {
    static ACTIVE;
    static WAITING;
    static PAUSED;
    static ERROR;
    static COMPLETE;
    static REMOVED;
    static UNKNOWN;
}

/*export interface Aria2TrackStatus {
    gid: string;
    status?: 'active' | 'waiting' | 'paused' | 'error' | 'complete' | 'removed';
    totalLength?: string;
    completedLength?: string;
    uploadLength?: string;
    bitfield?: string;
    downloadSpeed?: string;
    uploadSpeed?: string;
    infoHash?: string;
    numSeeders?: string;
    seeder?: 'true' | 'false';
    pieceLength?: string;
    numPieces?: string;
    connections?: string;
    errorCode?: string;
    errorMessage?: string;
    followedBy?: string[];
    following?: string;
    belongsTo?: string;
    dir?: string;
    files?: string; // TODO
    bittorrent?: {
        annonceList: string[],
        comment: string,
        creationDate: string,
        mode: 'single' | 'multi',
        info: { name: string | { 'utf-8': string } }
    };
    verifiedLength?: string;
    verifiedIntegrityPending?: 'true' | string;

}*/

// Routes
const routes = [
    {
        displayName: 'Home / Status',
        routeName: 'status',
        iconName: 'gauge'
    }, {
        displayName: 'Aria2',
        routeName: 'aria',
        iconName: 'cloud-sync'
    }
];

// Status indicators
const indicators = [
    {
        title: 'OS',
        value: 'Raspbian',
        icon: 'raspberry-pi',
        cssClasses: 'green'
    }, {
        title: 'Uptime',
        value: '20d 5h',
        icon: 'clock',
        cssClasses: 'pink'
    }, {
        title: 'CPU Load',
        value: '12%',
        icon: 'chip',
        cssClasses: 'blue'
    }, {
        title: 'RAM Usage',
        value: '56%',
        icon: 'memory',
        cssClasses: 'teal'
    }, {
        title: 'Network',
        value: '512 KB/s',
        icon: 'speedometer',
        cssClasses: 'deep-orange lighten-2'
    }, {
        title: 'Disk Usage',
        value: '25%',
        icon: 'harddisk',
        cssClasses: 'deep-purple'
    }, {
        title: 'Aria2 Status',
        value: 'v1.34.0',
        icon: 'cloud-tags',
        cssClasses: 'cyan'
    }, {
        title: 'Active Downloads',
        value: '25',
        icon: 'download-multiple',
        cssClasses: 'indigo'
    }
];

export default new Vuex.Store({
    modules: {
        drawer, persistence, auth
    },

    state: {
        isOnline: true,

        navigationLinks: routes,
        statusIndicators: indicators,
    },

    getters: {
        isAppLocked(state) {
            return !state.isOnline || state.auth.isLoggedIn;
        }
    },

    mutations: {
        setOnlineState(state, payload) {
            state.isOnline = payload.isOnline;
        }
    },
    actions: {}
});
