import Vue from 'vue';
import Router from 'vue-router';
import StatusBoard from './views/StatusBoard';
import AriaBoard from './views/AriaBoard';
import Home from './views/Home';
import store from './store/index';
import FilesView from './views/FilesView';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/status',
            name: 'status',
            component: StatusBoard
        }, {
            path: '/aria',
            name: 'aria',
            component: AriaBoard
        }, {
            path: '/files',
            name: 'files',
            component: FilesView
        }
    ]
});

router.beforeEach((to, from, next) => {
    // Exclude home from this guard
    if (to.name === 'home') {
        next();
        return;
    }

    // Refuse access to anything if the app is locked
    if (store.getters.isAppUnlocked) {
        next();
    } else {
        // Save current navigation to pop it later and return to home
        store.commit('setBlockedNavigation', {routeName: to.name});
        next({name: 'home'});
    }
});

export default router;
