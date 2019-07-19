<template>
    <VToolbar app flat>
        <VToolbarSideIcon @click="toggleDrawerVisible()"/>
    </VToolbar>
</template>

<script lang="ts">
    import { mapMutations } from 'vuex';


    export default {
        name: 'TheToolbar',

        methods: mapMutations(['toggleDrawerVisible'])
    };
</script>

<style scoped>

</style>
