<template>
    <VNavigationDrawer app dark disable-route-watcher clipped
                       v-model="drawerVisible"
                       :mini-variant.sync="drawerMini">

        <!-- Header -->
        <VList dense nav class="py-0">
            <VListItem>
                <VListItemAvatar>
                    <img src="../assets/logo.png" alt="Logo"/>
                </VListItemAvatar>

                <VListItemTitle>Navigation</VListItemTitle>

                <VBtn icon @click.stop="drawerMini = !drawerMini">
                    <VIcon>mdi-chevron-left</VIcon>
                </VBtn>
            </VListItem>

            <!-- Links -->
            <VDivider/>

            <VListItem v-for="link in navigationLinks" :key="link.routeName"
                       ripple link
                       @click.stop="navigate(link.routeName)">

                <VListItemAction>
                    <VIcon>mdi-{{ link.iconName }}</VIcon>
                </VListItemAction>

                <VListItemContent>
                    <VListItemTitle>{{ link.displayName }}</VListItemTitle>
                </VListItemContent>

            </VListItem>

        </VList>

    </VNavigationDrawer>
</template>

<script lang="js">
    import { mapState } from 'vuex';

    export default {
        name: 'TheSidebar',

        computed: {
            drawerVisible: {
                get() {
                    return this.$store.state.drawer.isVisible;
                },

                set(state) {
                    this.$store.commit('setDrawerState', {isVisible: state});
                }
            },

            drawerMini: {
                get() {
                    return this.$store.state.drawer.isMini;
                },

                set(state) {
                    this.$store.commit('setDrawerState', {isMini: state});
                }
            },

            ...mapState(['navigationLinks'])
        },

        methods: {
            navigate(to) {
                this.$router.push({name: to});
            }
        }
    };
</script>

<style scoped>

</style>
