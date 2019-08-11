<template>
    <VAppBar app flat dark color="primary" :hide-on-scroll="hideOnScroll">
        <VAppBarNavIcon @click="toggleDrawerVisible()"/>
        <VToolbarTitle class="headline font-weight-light text-uppercase">Downloader Dashboard</VToolbarTitle>
        <VSpacer/>

        <!-- If big screen, display inline -->
        <template v-if="$vuetify.breakpoint.mdAndUp">
            <OnlineChip :is-online="isOnline"/>
        </template>

        <!-- If small screen, display under -->
        <template v-if="$vuetify.breakpoint.smAndDown" v-slot:extension>
            <VSpacer/>
            <OnlineChip :is-online="isOnline"/>
        </template>
    </VAppBar>
</template>

<script lang="js">
    import { mapMutations, mapState } from 'vuex';
    import OnlineChip from '@/components/OnlineChip.vue';
    import { healthRequest } from '../repositories/repository';

    export default {
        name: 'TheAppBar',
        components: {OnlineChip},
        computed: {
            ...mapState(['isOnline']),

            hideOnScroll() {
                return this.$vuetify.breakpoint.smAndDown;
            }
        },

        methods: {
            ...mapMutations(['toggleDrawerVisible']),

            onOnline() {
                this.$store.commit('setOnlineState', {isOnline: true});
            },
            onOffline() {
                this.$store.commit('setOnlineState', {isOnline: false});
            }
        },

        mounted() {
            healthRequest.poll(5000, res => {
                if (res.status === 200) {
                    console.log('Ok !');
                } else {
                    console.log('Not ok');
                }
            }, err => {
                console.log('Really not ok');
            });

            window.addEventListener('online', this.onOnline);
            window.addEventListener('offline', this.onOffline);

            // Trigger initial state
            (navigator.onLine ? this.onOnline : this.onOffline)();
        },

        beforeDestroy() {
            healthRequest.stopPolling();

            window.removeEventListener('online', this.onOnline);
            window.removeEventListener('offline', this.onOffline);
        }
    };
</script>

