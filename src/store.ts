import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface NavigationLink {
    displayName: string;
    routeName: string;
    iconName: string;
}

export interface DrawerState {
    isVisible?: boolean;
    isMini?: boolean;
}

const routes: NavigationLink[] = [
    {
        displayName: 'Home',
        routeName: 'home',
        iconName: 'home'
    }
];

export default new Vuex.Store({
    state: {
        drawer: {
            isVisible: true,
            isMini: true
        },

        navigationLinks: routes
    },

    mutations: {
        setDrawerState(state, payload: DrawerState) {
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
