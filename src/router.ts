import Vue from 'vue';
import Router from 'vue-router';
import StatusBoard from '@/views/StatusBoard.vue';
import AriaBoard from '@/views/AriaBoard.vue';


Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'status',
            component: StatusBoard
        }, {
            path: '/aria',
            name: 'aria',
            component: AriaBoard
        }
    ]
});
