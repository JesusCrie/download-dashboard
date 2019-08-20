import Vue from 'vue';
import Vuex from 'vuex';
import drawer from './modules/drawer';
import persistence from './modules/persistence';
import auth from './modules/auth';
import aria from './modules/aria';

Vue.use(Vuex);

export class TrackStatus {
    static ACTIVE = 'active';
    static WAITING = 'waiting';
    static PAUSED = 'paused';
    static ERROR = 'error';
    static COMPLETE = 'complete';
    static REMOVED = 'removed';
    static UNKNOWN;
}

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
        drawer, persistence, auth, aria
    },

    state: {
        isOnline: true,
        blockedNavigation: null,

        navigationLinks: routes,
        statusIndicators: indicators
    },

    getters: {
        isAppUnlocked(state) {
            return state.isOnline && state.auth.isLoggedIn;
        }
    },

    mutations: {
        setOnlineState(state, {isOnline}) {
            state.isOnline = isOnline;
        },

        setBlockedNavigation(state, {routeName}) {
            state.blockedNavigation = routeName;
        }
    }
});
