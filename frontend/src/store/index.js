import Vue from 'vue';
import Vuex from 'vuex';
import drawer from './modules/drawer';
import persistence from './modules/persistence';
import auth from './modules/auth';
import status from './modules/status';
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

export default new Vuex.Store({
    modules: {
        drawer, persistence,
        auth, status, aria
    },

    state: {
        isOnline: true,
        blockedNavigation: null,
        navigationLinks: routes
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
