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

<script lang="ts">
    import TheSidebar from '@/components/TheSidebar.vue';
    import TheAppBar from '@/components/TheAppBar.vue';

    export default {
        name: 'App',
        components: {TheAppBar, TheSidebar}
    };
</script>
