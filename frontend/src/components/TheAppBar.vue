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
        }
    };
</script>

