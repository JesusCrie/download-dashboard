<template>
    <VApp>
        <!-- Drawer -->
        <TheSidebar/>

        <!-- Toolbar -->
        <TheToolbar/>

        <!-- Content -->
        <VContent>
            <VContainer fluid>
                <router-view />
            </VContainer>
        </VContent>

        <!-- Footer -->
        <VFooter app/>
    </VApp>
</template>

<script lang="ts">
    import TheSidebar from '@/components/TheSidebar.vue';
    import TheToolbar from '@/components/TheToolbar.vue';

    export default {
        name: 'App',
        components: {TheToolbar, TheSidebar}
    };
</script>
