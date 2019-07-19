<template>
    <VNavigationDrawer app stateless dark
                       v-model="drawerVisible"
                       :mini-variant.sync="drawerMini">

        <!-- Header -->
        <VToolbar flat class="transparent">
            <VList>
                <VListTile avatar>
                    <VListTileAvatar>
                        <img src="../assets/logo.png" alt="Logo"/>
                    </VListTileAvatar>

                    <VListTileContent>
                        <VListTileTitle>Downloader Dashboard</VListTileTitle>
                    </VListTileContent>

                    <VListTileAction>
                        <VBtn icon @click.stop="drawerMini = !drawerMini">
                            <VIcon>mdi-chevron-left</VIcon>
                        </VBtn>
                    </VListTileAction>
                </VListTile>
            </VList>
        </VToolbar>

        <!-- Links -->
        <VList>
            <VDivider/>

            <VListTile v-for="link in navigationLinks" :key="link.routeName"
                       v-ripple="true"
                       @click="navigate(link.routeName)">

                <VListTileAction>
                    <VIcon>mdi-{{ link.iconName }}</VIcon>
                </VListTileAction>

                <VListTileContent>
                    <VListTileTitle>{{ link.displayName }}</VListTileTitle>
                </VListTileContent>

            </VListTile>

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
