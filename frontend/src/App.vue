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
    import { healthRequest } from './repositories/repository';

    export default {
        name: 'App',
        components: {TheAppBar, TheSidebar},

        beforeCreate() {
            // Setup local storage
            this.$store.commit('persistence/detectStorage');

            // Load tokens
            if (this.$store.getters['persistence/isAvailable']) {
                const get = this.$store.getters['persistence/retriever'];
                this.$store.commit('auth/loadTokensFromPersistence', {get});
            }

            // Give a way for the auth to persist its tokens
            const set = this.$store.getters['persistence/persister'];
            this.$store.commit('auth/setPersister', {set});

            // Check auth status and try to refresh
            this.$store.dispatch('auth/checkAuth');
        },

        beforeMount() {
            // Start polling service health
            healthRequest.poll(10_000, () => {
                this.$store.commit('setOnlineState', {isOnline: true});

                // If service online, check auth
                this.$store.dispatch('auth/checkAuth');

            }, () => {
                this.$store.commit('setOnlineState', {isOnline: false});
                this.$store.commit('auth/setLogged', {loggedIn: false});
            });

            this.$store.watch(
                (state, getters) => getters.isAppUnlocked,
                (current, prev) => {
                    if (prev === false && current === true) {
                        // If app just unlocked, navigate to status page / previous
                        if (this.$store.state.blockedNavigation) {
                            this.$router.push({name: this.$store.state.blockedNavigation});
                            this.$store.commit('setBlockedNavigation', {routeName: null});
                        } else {
                            this.$router.push({name: 'status'});
                        }

                    } else if (prev === true && current === false) {
                        // If app just locked, navigate to home page
                        this.$router.push({name: 'home'});
                    }
                }
            );
        },

        beforeDestroy() {
            healthRequest.stopPolling();
        }
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
