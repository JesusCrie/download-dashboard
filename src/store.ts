import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface NavigationLink {
    displayName: string;
    routeName: string;
    iconName: string;
}

export interface StatusIndicator {
    title: string;
    value: string | number;
    icon?: string;
    cssColor?: string | number;
    cssClasses?: string;
}

export interface Aria2TrackStatus {
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
    verifiedIntegrityPending?: 'true'|string;

}

// Routes
const routes: NavigationLink[] = [
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
const indicators: StatusIndicator[] = [
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
    state: {
        isOnline: true,
        drawer: {
            isVisible: true,
            isMini: true
        },
        navigationLinks: routes,
        statusIndicators: indicators
    },

    mutations: {
        setOnlineState(state, payload: { isOnline: boolean }) {
            state.isOnline = payload.isOnline;
        },

        setDrawerState(state, payload: { isVisible?: boolean, isMini?: boolean }) {
            if (payload.isVisible !== undefined) {
                state.drawer.isVisible = payload.isVisible;
            }

            if (payload.isMini !== undefined) {
                state.drawer.isMini = payload.isMini;
            }
        },

        toggleDrawerVisible(state) {
            // @ts-ignore
            this.commit('setDrawerState', {isVisible: !state.drawer.isVisible});
        }
    },
    actions: {}
});
