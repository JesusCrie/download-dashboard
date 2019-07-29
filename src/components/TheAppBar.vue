<template>
    <VAppBar app flat dark color="primary" clipped-left>
        <VAppBarNavIcon @click="toggleDrawerVisible()"/>
        <VToolbarTitle class="headline font-weight-light text-uppercase">Downloader Dashboard</VToolbarTitle>
        <VSpacer/>

        <!-- If big screen, display inline -->
        <template v-if="$vuetify.breakpoint.mdAndUp">
            <OnlineBadge :is-online="isOnline"/>
        </template>

        <!-- If small screen, display under -->
        <template v-slot:extension v-if="$vuetify.breakpoint.smAndDown">
            <VSpacer/>
            <OnlineBadge :is-online="isOnline"/>
        </template>
    </VAppBar>
</template>

<script lang="js">
    import { mapMutations, mapState } from 'vuex';
    import OnlineBadge from '@/components/OnlineBadge';

    export default {
        name: 'TheAppBar',
        components: {OnlineBadge},
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

