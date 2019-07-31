<template>
    <VApp>
        <VSystemBar v-if="$vuetify.breakpoint.smAndDown"/>

        <!-- Drawer -->
        <TheSidebar/>

        <!-- Toolbar -->
        <TheAppBar/>

        <!-- Content -->
        <VContent>
            <router-view/>
        </VContent>

        <!-- Footer, no really need for now -->
        <!--VFooter app>
            <VFlex text-xs-center xs12>
                &copy; 2019 - <strong>Lucas Malandrino</strong>
            </VFlex>
        </VFooter-->
    </VApp>
</template>

<script lang="js">
    import TheSidebar from '@/components/TheSidebar.vue';
    import TheAppBar from '@/components/TheAppBar.vue';

    export default {
        name: 'App',
        components: {TheAppBar, TheSidebar}
    };
</script>

<!-- Global non scoped styles -->
<style lang="scss">
    .no-radius {
        &.left {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
        }

        &.right {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
        }
    }

    .underline {
        text-decoration: underline;
    }
</style>
