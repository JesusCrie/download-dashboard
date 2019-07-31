<template>
    <VAppBar app flat dark color="primary">
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
    import OnlineChip from '@/components/OnlineChip';

    export default {
        name: 'TheAppBar',
        components: {OnlineChip},
        computed: {
            ...mapState(['isOnline'])
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
            window.addEventListener('online', this.onOnline);
            window.addEventListener('offline', this.onOffline);

            // Trigger initial state
            (navigator.onLine ? this.onOnline : this.onOffline)();
        },
        beforeDestroy() {
            window.removeEventListener('online', this.onOnline);
            window.removeEventListener('offline', this.onOffline);
        }
    };
</script>

