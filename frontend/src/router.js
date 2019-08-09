import Vue from 'vue';
import Router from 'vue-router';
import StatusBoard from './views/StatusBoard';
import AriaBoard from './views/AriaBoard';
import Home from './views/Home';


Vue.use(Router);

export default new Router({
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
        }
    ]
});
